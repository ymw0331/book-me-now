import { api } from '@/lib/axios';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  ApiResponse,
} from '@/types/api';

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

/**
 * Authentication service for handling user auth operations
 */
export class AuthService {
  private readonly basePath = '/auth';

  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(
      `${this.basePath}/login`,
      credentials
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Login failed');
    }

    return response.data;
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(
      `${this.basePath}/register`,
      userData
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Registration failed');
    }

    return response.data;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await api.post(`${this.basePath}/logout`);
    } catch (error) {
      // Logout should succeed even if server call fails
      console.warn('Server logout failed:', error);
    }
  }

  /**
   * Verify JWT token
   */
  async verifyToken(): Promise<User> {
    const response = await api.get<ApiResponse<User>>(`${this.basePath}/verify`);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Token verification failed');
    }

    return response.data;
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>(`${this.basePath}/me`);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get user profile');
    }

    return response.data;
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: UpdateProfileRequest): Promise<User> {
    const response = await api.put<ApiResponse<User>>(
      `${this.basePath}/me`,
      updates
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update profile');
    }

    return response.data;
  }

  /**
   * Change user password
   */
  async changePassword(passwordData: ChangePasswordRequest): Promise<void> {
    const response = await api.post<ApiResponse<void>>(
      `${this.basePath}/change-password`,
      passwordData
    );

    if (!response.success) {
      throw new Error(response.error || 'Failed to change password');
    }
  }

  /**
   * Request password reset email
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    const response = await api.post<ApiResponse<void>>(
      `${this.basePath}/forgot-password`,
      data
    );

    if (!response.success) {
      throw new Error(response.error || 'Failed to send reset email');
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    const response = await api.post<ApiResponse<void>>(
      `${this.basePath}/reset-password`,
      data
    );

    if (!response.success) {
      throw new Error(response.error || 'Failed to reset password');
    }
  }

  /**
   * Delete user account
   */
  async deleteAccount(): Promise<void> {
    const response = await api.delete<ApiResponse<void>>(`${this.basePath}/me`);

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete account');
    }
  }

  /**
   * Refresh auth token (if using refresh tokens)
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(
      `${this.basePath}/refresh`,
      { refreshToken }
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to refresh token');
    }

    return response.data;
  }

  /**
   * Check if email is available for registration
   */
  async checkEmailAvailability(email: string): Promise<boolean> {
    const response = await api.get<ApiResponse<{ available: boolean }>>(
      `${this.basePath}/check-email?email=${encodeURIComponent(email)}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to check email availability');
    }

    return response.data.available;
  }

  /**
   * Resend email verification
   */
  async resendVerificationEmail(): Promise<void> {
    const response = await api.post<ApiResponse<void>>(
      `${this.basePath}/resend-verification`
    );

    if (!response.success) {
      throw new Error(response.error || 'Failed to resend verification email');
    }
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<void> {
    const response = await api.post<ApiResponse<void>>(
      `${this.basePath}/verify-email`,
      { token }
    );

    if (!response.success) {
      throw new Error(response.error || 'Failed to verify email');
    }
  }
}

// Create singleton instance
export const authService = new AuthService();

// Export instance as default
export default authService;