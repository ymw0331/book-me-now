import { LoginCredentials, RegisterCredentials, AuthResponse, RegisterResponse, User } from '@/types/auth';

// API Configuration
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

// API Error handling
export class AuthAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'AuthAPIError';
  }
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.baseURL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    headers: {
      ...API_CONFIG.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // Handle non-JSON responses (like error messages)
    const contentType = response.headers.get('content-type');
    let data: any;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage = typeof data === 'string' ? data :
                          data?.message ||
                          data?.error ||
                          `HTTP Error: ${response.status}`;

      throw new AuthAPIError(errorMessage, response.status);
    }

    return data;
  } catch (error) {
    if (error instanceof AuthAPIError) {
      throw error;
    }

    // Network or other errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new AuthAPIError('Network error. Please check your connection.');
    }

    throw new AuthAPIError(
      error instanceof Error ? error.message : 'An unexpected error occurred'
    );
  }
}

// Auth API Service
export const authAPI = {
  /**
   * Login user with email and password
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Register new user
   */
  register: async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
    return apiRequest<RegisterResponse>('/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Verify JWT token and get user data
   */
  verifyToken: async (token: string): Promise<{ user: User }> => {
    return apiRequest<{ user: User }>('/verify-token', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (token: string): Promise<User> => {
    return apiRequest<User>('/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  /**
   * Update user profile
   */
  updateProfile: async (token: string, updates: Partial<User>): Promise<User> => {
    return apiRequest<User>('/me', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
  },

  /**
   * Change password
   */
  changePassword: async (
    token: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>('/change-password', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>('/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Reset password with token
   */
  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>('/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        token,
        password: newPassword,
      }),
    });
  },

  /**
   * Logout user (if server-side logout is needed)
   */
  logout: async (token: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>('/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  /**
   * Delete user account
   */
  deleteAccount: async (token: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>('/delete-account', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

// Helper functions
export const createAuthHeader = (token: string) => ({
  'Authorization': `Bearer ${token}`,
});

export const isAuthError = (error: unknown): error is AuthAPIError => {
  return error instanceof AuthAPIError;
};

// Token utilities
export const tokenUtils = {
  /**
   * Check if token is expired (basic check without JWT parsing)
   */
  isTokenExpired: (token: string): boolean => {
    try {
      // Basic JWT structure check
      const parts = token.split('.');
      if (parts.length !== 3) return true;

      // Decode payload (without verification)
      const payload = JSON.parse(atob(parts[1]));
      const exp = payload.exp;

      if (!exp) return false;

      // Check if token is expired (with 30 second buffer)
      return Date.now() >= (exp * 1000) - 30000;
    } catch {
      return true;
    }
  },

  /**
   * Get token expiration date
   */
  getTokenExpiration: (token: string): Date | null => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = JSON.parse(atob(parts[1]));
      const exp = payload.exp;

      return exp ? new Date(exp * 1000) : null;
    } catch {
      return null;
    }
  },

  /**
   * Get user ID from token
   */
  getUserIdFromToken: (token: string): string | null => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = JSON.parse(atob(parts[1]));
      return payload._id || payload.sub || payload.userId || null;
    } catch {
      return null;
    }
  },
};