// Auth Types based on legacy MERN User model

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  stripe_account_id?: string;
  stripe_seller?: Record<string, any>;
  stripeSession?: Record<string, any>;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthError {
  message: string;
  status?: number;
}

// Auth API response types
export interface LoginResponse extends AuthResponse {}

export interface RegisterResponse {
  ok: boolean;
}

// Form validation types
export interface LoginFormData extends LoginCredentials {}

export interface RegisterFormData extends RegisterCredentials {
  confirmPassword?: string;
}

// Store action types
export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  checkAuth: () => void;
  initializeAuth: () => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;