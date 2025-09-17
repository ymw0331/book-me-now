import { authService } from './auth.service';
import { propertiesService } from './properties.service';
import { ordersService } from './orders.service';
import { stripeService } from './stripe.service';
import { setAuthToken, getAuthToken } from '@/lib/axios';

/**
 * Main API service that coordinates all other services
 * Provides a single entry point for all API operations
 */
export class APIService {
  // Service instances
  public readonly auth = authService;
  public readonly properties = propertiesService;
  public readonly orders = ordersService;
  public readonly stripe = stripeService;

  /**
   * Initialize the API service with auth token
   */
  initialize(token?: string) {
    if (token) {
      setAuthToken(token);
    } else {
      // Try to get token from localStorage
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
          setAuthToken(storedToken);
        }
      }
    }
  }

  /**
   * Set authentication token for all requests
   */
  setToken(token: string | null) {
    setAuthToken(token);

    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  /**
   * Get current authentication token
   */
  getToken(): string | null {
    return getAuthToken();
  }

  /**
   * Clear authentication token
   */
  clearToken() {
    setAuthToken(null);

    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!getAuthToken();
  }

  /**
   * Login and set token
   */
  async login(credentials: { email: string; password: string }) {
    const response = await this.auth.login(credentials);
    this.setToken(response.token);
    return response;
  }

  /**
   * Register and set token
   */
  async register(userData: { name: string; email: string; password: string }) {
    const response = await this.auth.register(userData);
    this.setToken(response.token);
    return response;
  }

  /**
   * Logout and clear token
   */
  async logout() {
    try {
      await this.auth.logout();
    } finally {
      this.clearToken();
    }
  }

  /**
   * Refresh authentication token if needed
   */
  async refreshTokenIfNeeded(): Promise<boolean> {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    try {
      // Try to verify current token
      await this.auth.verifyToken();
      return true;
    } catch (error) {
      // Token is invalid, clear it
      this.clearToken();
      return false;
    }
  }

  /**
   * Health check - verify API connectivity
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: {
      auth: boolean;
      properties: boolean;
      orders: boolean;
      stripe: boolean;
    };
    timestamp: string;
  }> {
    const results = {
      auth: false,
      properties: false,
      orders: false,
      stripe: false,
    };

    const timestamp = new Date().toISOString();

    // Test each service
    try {
      await this.auth.verifyToken();
      results.auth = true;
    } catch {
      // Auth may fail if not logged in, which is normal
      results.auth = !this.isAuthenticated();
    }

    try {
      await this.properties.getProperties({ limit: 1 });
      results.properties = true;
    } catch {
      // Properties service failed
    }

    try {
      await this.orders.getOrders({ limit: 1 });
      results.orders = true;
    } catch {
      // Orders service failed
    }

    try {
      if (this.isAuthenticated()) {
        await this.stripe.getConnectAccount();
        results.stripe = true;
      } else {
        // Can't test Stripe without auth
        results.stripe = true;
      }
    } catch {
      // Stripe service failed
    }

    const healthyServices = Object.values(results).filter(Boolean).length;
    const totalServices = Object.keys(results).length;

    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (healthyServices === totalServices) {
      status = 'healthy';
    } else if (healthyServices > 0) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    return {
      status,
      services: results,
      timestamp,
    };
  }

  /**
   * Batch request utility for multiple API calls
   */
  async batchRequest<T extends Record<string, () => Promise<any>>>(
    requests: T
  ): Promise<{
    [K in keyof T]: {
      success: boolean;
      data?: Awaited<ReturnType<T[K]>>;
      error?: string;
    };
  }> {
    const results = {} as any;

    await Promise.allSettled(
      Object.entries(requests).map(async ([key, requestFn]) => {
        try {
          const data = await requestFn();
          results[key] = { success: true, data };
        } catch (error) {
          results[key] = {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      })
    );

    return results;
  }

  /**
   * Get user dashboard data in a single request
   */
  async getDashboardData() {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required');
    }

    return this.batchRequest({
      user: () => this.auth.getCurrentUser(),
      properties: () => this.properties.getUserProperties({ limit: 10 }),
      orders: () => this.orders.getUserOrders({ limit: 10 }),
      stripeAccount: () => this.stripe.getConnectAccount(),
      upcomingBookings: () => this.orders.getUpcomingBookings(5),
    });
  }

  /**
   * Get host dashboard data
   */
  async getHostDashboardData() {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required');
    }

    return this.batchRequest({
      user: () => this.auth.getCurrentUser(),
      properties: () => this.properties.getUserProperties({ limit: 10 }),
      hostOrders: () => this.orders.getHostOrders({ limit: 10 }),
      orderStats: () => this.orders.getOrderStats('month'),
      stripeAccount: () => this.stripe.getConnectAccount(),
      balance: () => this.stripe.getBalance(),
    });
  }
}

// Create singleton instance
export const apiService = new APIService();

// Initialize on import if in browser
if (typeof window !== 'undefined') {
  apiService.initialize();
}

// Export individual services for convenience
export {
  authService,
  propertiesService,
  ordersService,
  stripeService,
};

// Export instance as default
export default apiService;