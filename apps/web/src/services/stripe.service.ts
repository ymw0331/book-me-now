import { api } from '@/lib/axios';
import {
  StripeSessionRequest,
  StripeConnectRequest,
  StripeAccount,
  ApiResponse,
} from '@/types/api';

export interface PaymentIntentRequest {
  amount: number;
  currency?: string;
  orderId: string;
  description?: string;
}

export interface PaymentMethodRequest {
  type: 'card';
  card: {
    number: string;
    exp_month: number;
    exp_year: number;
    cvc: string;
  };
  billing_details?: {
    name?: string;
    email?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
  };
}

export interface StripeCheckoutSession {
  id: string;
  url: string;
  payment_status: string;
  amount_total: number;
  currency: string;
}

export interface StripeConnectOnboardingResponse {
  url: string;
  account_id: string;
}

export interface StripePayoutRequest {
  amount: number;
  currency?: string;
  description?: string;
}

export interface StripePayout {
  id: string;
  amount: number;
  currency: string;
  status: string;
  arrival_date: number;
  description?: string;
}

export interface StripeBalance {
  available: {
    amount: number;
    currency: string;
  }[];
  pending: {
    amount: number;
    currency: string;
  }[];
}

export interface StripeTransaction {
  id: string;
  amount: number;
  currency: string;
  type: 'payment' | 'payout' | 'refund' | 'fee';
  status: string;
  created: number;
  description?: string;
  fee?: number;
}

/**
 * Stripe service for handling payment operations
 */
export class StripeService {
  private readonly basePath = '/stripe';

  /**
   * Create Stripe checkout session for property booking
   */
  async createCheckoutSession(sessionData: StripeSessionRequest): Promise<StripeCheckoutSession> {
    const response = await api.post<ApiResponse<StripeCheckoutSession>>(
      `${this.basePath}/create-session`,
      sessionData
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create checkout session');
    }

    return response.data;
  }

  /**
   * Create payment intent for direct payment
   */
  async createPaymentIntent(paymentData: PaymentIntentRequest): Promise<{
    client_secret: string;
    payment_intent_id: string;
  }> {
    const response = await api.post<ApiResponse<{
      client_secret: string;
      payment_intent_id: string;
    }>>(`${this.basePath}/create-payment-intent`, paymentData);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create payment intent');
    }

    return response.data;
  }

  /**
   * Confirm payment intent
   */
  async confirmPaymentIntent(
    paymentIntentId: string,
    paymentMethodId: string
  ): Promise<{ status: string; payment_intent: any }> {
    const response = await api.post<ApiResponse<{
      status: string;
      payment_intent: any;
    }>>(`${this.basePath}/confirm-payment`, {
      payment_intent_id: paymentIntentId,
      payment_method_id: paymentMethodId,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to confirm payment');
    }

    return response.data;
  }

  /**
   * Get checkout session details
   */
  async getCheckoutSession(sessionId: string): Promise<StripeCheckoutSession> {
    const response = await api.get<ApiResponse<StripeCheckoutSession>>(
      `${this.basePath}/session/${sessionId}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to retrieve checkout session');
    }

    return response.data;
  }

  /**
   * Setup Stripe Connect for host onboarding
   */
  async createConnectAccount(accountData?: StripeConnectRequest): Promise<StripeConnectOnboardingResponse> {
    const response = await api.post<ApiResponse<StripeConnectOnboardingResponse>>(
      `${this.basePath}/connect`,
      accountData || {}
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create Stripe Connect account');
    }

    return response.data;
  }

  /**
   * Get Stripe Connect account details
   */
  async getConnectAccount(): Promise<StripeAccount> {
    const response = await api.get<ApiResponse<StripeAccount>>(
      `${this.basePath}/account`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to retrieve Stripe account');
    }

    return response.data;
  }

  /**
   * Update Stripe Connect account
   */
  async updateConnectAccount(updates: Partial<StripeAccount>): Promise<StripeAccount> {
    const response = await api.put<ApiResponse<StripeAccount>>(
      `${this.basePath}/account`,
      updates
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update Stripe account');
    }

    return response.data;
  }

  /**
   * Create account onboarding link
   */
  async createAccountLink(): Promise<{ url: string }> {
    const response = await api.post<ApiResponse<{ url: string }>>(
      `${this.basePath}/account-link`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create account link');
    }

    return response.data;
  }

  /**
   * Create login link for Stripe Express dashboard
   */
  async createLoginLink(): Promise<{ url: string }> {
    const response = await api.post<ApiResponse<{ url: string }>>(
      `${this.basePath}/login-link`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create login link');
    }

    return response.data;
  }

  /**
   * Get account balance
   */
  async getBalance(): Promise<StripeBalance> {
    const response = await api.get<ApiResponse<StripeBalance>>(
      `${this.basePath}/balance`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to retrieve balance');
    }

    return response.data;
  }

  /**
   * Create payout
   */
  async createPayout(payoutData: StripePayoutRequest): Promise<StripePayout> {
    const response = await api.post<ApiResponse<StripePayout>>(
      `${this.basePath}/payout`,
      payoutData
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create payout');
    }

    return response.data;
  }

  /**
   * Get payouts history
   */
  async getPayouts(params?: {
    limit?: number;
    starting_after?: string;
    ending_before?: string;
  }): Promise<{ data: StripePayout[]; has_more: boolean }> {
    const searchParams = new URLSearchParams();

    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.starting_after) searchParams.append('starting_after', params.starting_after);
    if (params?.ending_before) searchParams.append('ending_before', params.ending_before);

    const queryString = searchParams.toString();
    const url = queryString ? `${this.basePath}/payouts?${queryString}` : `${this.basePath}/payouts`;

    const response = await api.get<ApiResponse<{
      data: StripePayout[];
      has_more: boolean;
    }>>(url);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to retrieve payouts');
    }

    return response.data;
  }

  /**
   * Get transactions history
   */
  async getTransactions(params?: {
    limit?: number;
    starting_after?: string;
    ending_before?: string;
    type?: 'payment' | 'payout' | 'refund' | 'fee';
  }): Promise<{ data: StripeTransaction[]; has_more: boolean }> {
    const searchParams = new URLSearchParams();

    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.starting_after) searchParams.append('starting_after', params.starting_after);
    if (params?.ending_before) searchParams.append('ending_before', params.ending_before);
    if (params?.type) searchParams.append('type', params.type);

    const queryString = searchParams.toString();
    const url = queryString ? `${this.basePath}/transactions?${queryString}` : `${this.basePath}/transactions`;

    const response = await api.get<ApiResponse<{
      data: StripeTransaction[];
      has_more: boolean;
    }>>(url);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to retrieve transactions');
    }

    return response.data;
  }

  /**
   * Refund payment
   */
  async refundPayment(
    paymentIntentId: string,
    amount?: number,
    reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
  ): Promise<{ refund_id: string; status: string; amount: number }> {
    const response = await api.post<ApiResponse<{
      refund_id: string;
      status: string;
      amount: number;
    }>>(`${this.basePath}/refund`, {
      payment_intent_id: paymentIntentId,
      amount,
      reason,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to process refund');
    }

    return response.data;
  }

  /**
   * Get payment methods for customer
   */
  async getPaymentMethods(): Promise<any[]> {
    const response = await api.get<ApiResponse<any[]>>(
      `${this.basePath}/payment-methods`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to retrieve payment methods');
    }

    return response.data;
  }

  /**
   * Save payment method for future use
   */
  async savePaymentMethod(paymentMethodId: string): Promise<void> {
    const response = await api.post<ApiResponse<void>>(
      `${this.basePath}/save-payment-method`,
      { payment_method_id: paymentMethodId }
    );

    if (!response.success) {
      throw new Error(response.error || 'Failed to save payment method');
    }
  }

  /**
   * Delete saved payment method
   */
  async deletePaymentMethod(paymentMethodId: string): Promise<void> {
    const response = await api.delete<ApiResponse<void>>(
      `${this.basePath}/payment-methods/${paymentMethodId}`
    );

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete payment method');
    }
  }

  /**
   * Get webhook events for debugging
   */
  async getWebhookEvents(params?: {
    limit?: number;
    starting_after?: string;
    type?: string;
  }): Promise<{ data: any[]; has_more: boolean }> {
    const searchParams = new URLSearchParams();

    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.starting_after) searchParams.append('starting_after', params.starting_after);
    if (params?.type) searchParams.append('type', params.type);

    const queryString = searchParams.toString();
    const url = queryString ? `${this.basePath}/webhook-events?${queryString}` : `${this.basePath}/webhook-events`;

    const response = await api.get<ApiResponse<{
      data: any[];
      has_more: boolean;
    }>>(url);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to retrieve webhook events');
    }

    return response.data;
  }
}

// Create singleton instance
export const stripeService = new StripeService();

// Export instance as default
export default stripeService;