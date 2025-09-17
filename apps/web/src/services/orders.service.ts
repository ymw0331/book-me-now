import { api } from '@/lib/axios';
import {
  Order,
  CreateOrderRequest,
  ApiResponse,
  PaginatedResponse,
} from '@/types/api';

export interface OrderFilters {
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  fromDate?: string;
  toDate?: string;
  propertyId?: string;
  guestId?: string;
}

export interface OrderPagination {
  page?: number;
  limit?: number;
}

export interface OrderSort {
  sortBy?: 'createdAt' | 'checkIn' | 'checkOut' | 'totalAmount';
  sortOrder?: 'asc' | 'desc';
}

export interface OrderSearchParams extends OrderFilters, OrderPagination, OrderSort {}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

export interface BookingDetails {
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  stripeSessionId?: string;
  specialRequests?: string;
}

export interface CreateBookingRequest extends CreateOrderRequest {
  booking: BookingDetails;
}

export interface UpdateOrderRequest {
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

/**
 * Orders service for handling booking operations
 */
export class OrdersService {
  private readonly basePath = '/orders';

  /**
   * Get all orders with optional filters and pagination
   */
  async getOrders(params?: OrderSearchParams): Promise<PaginatedResponse<Order>> {
    const searchParams = new URLSearchParams();

    // Add filters
    if (params?.status) searchParams.append('status', params.status);
    if (params?.fromDate) searchParams.append('fromDate', params.fromDate);
    if (params?.toDate) searchParams.append('toDate', params.toDate);
    if (params?.propertyId) searchParams.append('propertyId', params.propertyId);
    if (params?.guestId) searchParams.append('guestId', params.guestId);

    // Add pagination
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    // Add sorting
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);

    const queryString = searchParams.toString();
    const url = queryString ? `${this.basePath}?${queryString}` : this.basePath;

    const response = await api.get<PaginatedResponse<Order>>(url);

    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch orders');
    }

    return response;
  }

  /**
   * Get single order by ID
   */
  async getOrder(id: string): Promise<Order> {
    const response = await api.get<ApiResponse<Order>>(`${this.basePath}/${id}`);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Order not found');
    }

    return response.data;
  }

  /**
   * Create new booking/order
   */
  async createOrder(orderData: CreateBookingRequest): Promise<Order> {
    const response = await api.post<ApiResponse<Order>>(
      this.basePath,
      orderData
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create order');
    }

    return response.data;
  }

  /**
   * Update existing order
   */
  async updateOrder(id: string, updates: UpdateOrderRequest): Promise<Order> {
    const response = await api.put<ApiResponse<Order>>(
      `${this.basePath}/${id}`,
      updates
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update order');
    }

    return response.data;
  }

  /**
   * Cancel order
   */
  async cancelOrder(id: string, reason?: string): Promise<Order> {
    const response = await api.patch<ApiResponse<Order>>(
      `${this.basePath}/${id}/cancel`,
      { reason }
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to cancel order');
    }

    return response.data;
  }

  /**
   * Confirm order (for hosts)
   */
  async confirmOrder(id: string): Promise<Order> {
    const response = await api.patch<ApiResponse<Order>>(
      `${this.basePath}/${id}/confirm`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to confirm order');
    }

    return response.data;
  }

  /**
   * Complete order (mark as finished)
   */
  async completeOrder(id: string): Promise<Order> {
    const response = await api.patch<ApiResponse<Order>>(
      `${this.basePath}/${id}/complete`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to complete order');
    }

    return response.data;
  }

  /**
   * Get orders for current user (as guest)
   */
  async getUserOrders(params?: OrderSearchParams): Promise<PaginatedResponse<Order>> {
    const searchParams = new URLSearchParams();

    // Add filters
    if (params?.status) searchParams.append('status', params.status);
    if (params?.fromDate) searchParams.append('fromDate', params.fromDate);
    if (params?.toDate) searchParams.append('toDate', params.toDate);

    // Add pagination
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    // Add sorting
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);

    const queryString = searchParams.toString();
    const url = queryString ? `${this.basePath}/user?${queryString}` : `${this.basePath}/user`;

    const response = await api.get<PaginatedResponse<Order>>(url);

    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch user orders');
    }

    return response;
  }

  /**
   * Get orders for properties owned by current user (as host)
   */
  async getHostOrders(params?: OrderSearchParams): Promise<PaginatedResponse<Order>> {
    const searchParams = new URLSearchParams();

    // Add filters
    if (params?.status) searchParams.append('status', params.status);
    if (params?.fromDate) searchParams.append('fromDate', params.fromDate);
    if (params?.toDate) searchParams.append('toDate', params.toDate);
    if (params?.propertyId) searchParams.append('propertyId', params.propertyId);

    // Add pagination
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    // Add sorting
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);

    const queryString = searchParams.toString();
    const url = queryString ? `${this.basePath}/host?${queryString}` : `${this.basePath}/host`;

    const response = await api.get<PaginatedResponse<Order>>(url);

    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch host orders');
    }

    return response;
  }

  /**
   * Get order statistics for dashboard
   */
  async getOrderStats(timeframe?: 'week' | 'month' | 'year'): Promise<OrderStats> {
    const params = timeframe ? `?timeframe=${timeframe}` : '';
    const response = await api.get<ApiResponse<OrderStats>>(
      `${this.basePath}/stats${params}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch order statistics');
    }

    return response.data;
  }

  /**
   * Get upcoming bookings for current user
   */
  async getUpcomingBookings(limit: number = 5): Promise<Order[]> {
    const response = await api.get<ApiResponse<Order[]>>(
      `${this.basePath}/upcoming?limit=${limit}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch upcoming bookings');
    }

    return response.data;
  }

  /**
   * Get booking history for current user
   */
  async getBookingHistory(params?: {
    page?: number;
    limit?: number;
    year?: number;
  }): Promise<PaginatedResponse<Order>> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.year) searchParams.append('year', params.year.toString());

    const queryString = searchParams.toString();
    const url = queryString ? `${this.basePath}/history?${queryString}` : `${this.basePath}/history`;

    const response = await api.get<PaginatedResponse<Order>>(url);

    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch booking history');
    }

    return response;
  }

  /**
   * Check for conflicts with existing bookings
   */
  async checkBookingConflicts(
    propertyId: string,
    checkIn: string,
    checkOut: string,
    excludeOrderId?: string
  ): Promise<{ hasConflict: boolean; conflictingOrders: Order[] }> {
    const params = new URLSearchParams({
      propertyId,
      checkIn,
      checkOut,
    });

    if (excludeOrderId) {
      params.append('excludeOrderId', excludeOrderId);
    }

    const response = await api.get<ApiResponse<{
      hasConflict: boolean;
      conflictingOrders: Order[];
    }>>(`${this.basePath}/check-conflicts?${params.toString()}`);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to check booking conflicts');
    }

    return response.data;
  }

  /**
   * Calculate booking total amount
   */
  async calculateBookingTotal(
    propertyId: string,
    checkIn: string,
    checkOut: string,
    guests: number
  ): Promise<{
    basePrice: number;
    taxes: number;
    fees: number;
    total: number;
    nights: number;
  }> {
    const params = new URLSearchParams({
      propertyId,
      checkIn,
      checkOut,
      guests: guests.toString(),
    });

    const response = await api.get<ApiResponse<{
      basePrice: number;
      taxes: number;
      fees: number;
      total: number;
      nights: number;
    }>>(`${this.basePath}/calculate-total?${params.toString()}`);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to calculate booking total');
    }

    return response.data;
  }

  /**
   * Add review for completed order
   */
  async addOrderReview(
    orderId: string,
    review: {
      rating: number;
      comment: string;
      cleanliness?: number;
      accuracy?: number;
      checkin?: number;
      communication?: number;
      location?: number;
      value?: number;
    }
  ): Promise<void> {
    const response = await api.post<ApiResponse<void>>(
      `${this.basePath}/${orderId}/review`,
      review
    );

    if (!response.success) {
      throw new Error(response.error || 'Failed to add review');
    }
  }

  /**
   * Get review for order
   */
  async getOrderReview(orderId: string): Promise<any> {
    const response = await api.get<ApiResponse<any>>(
      `${this.basePath}/${orderId}/review`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch review');
    }

    return response.data;
  }
}

// Create singleton instance
export const ordersService = new OrdersService();

// Export instance as default
export default ordersService;