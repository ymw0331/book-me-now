// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  stripe_account_id?: string;
  stripe_seller?: any;
  stripeSession?: any;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Property/Hotel Types
export interface Property {
  _id: string;
  title: string;
  content: string;
  location: string;
  price: number;
  postedBy: string | User;
  image?: {
    data: Buffer;
    contentType: string;
  };
  from: string;
  to: string;
  bed: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyRequest {
  title: string;
  content: string;
  location: string;
  price: number;
  from: string;
  to: string;
  bed: number;
  image?: File;
}

export interface UpdatePropertyRequest extends Partial<CreatePropertyRequest> {}

export interface PropertySearchQuery {
  location?: string;
  priceMin?: number;
  priceMax?: number;
  bed?: number;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

// Order Types
export interface Order {
  _id: string;
  hotel: string | Property;
  session: any;
  orderedBy: string | User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  hotel: string;
  session: any;
}

// Stripe Types
export interface StripeSessionRequest {
  hotelId: string;
}

export interface StripeConnectRequest {
  accountId?: string;
}

export interface StripeAccount {
  id: string;
  charges_enabled: boolean;
  details_submitted: boolean;
  payouts_enabled: boolean;
}

// Error Types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}