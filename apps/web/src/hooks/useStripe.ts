import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  stripeService,
  PaymentIntentRequest,
  StripePayoutRequest,
} from '@/services/stripe.service';
import { StripeSessionRequest, StripeConnectRequest } from '@/types/api';
import { useAuth } from './useAuth';

// Query keys for React Query
export const STRIPE_QUERY_KEYS = {
  all: ['stripe'] as const,
  account: () => [...STRIPE_QUERY_KEYS.all, 'account'] as const,
  balance: () => [...STRIPE_QUERY_KEYS.all, 'balance'] as const,
  session: (sessionId: string) => [...STRIPE_QUERY_KEYS.all, 'session', sessionId] as const,
  payouts: (params?: any) => [...STRIPE_QUERY_KEYS.all, 'payouts', params] as const,
  transactions: (params?: any) => [...STRIPE_QUERY_KEYS.all, 'transactions', params] as const,
  paymentMethods: () => [...STRIPE_QUERY_KEYS.all, 'payment-methods'] as const,
  webhookEvents: (params?: any) => [...STRIPE_QUERY_KEYS.all, 'webhook-events', params] as const,
} as const;

/**
 * Hook to fetch Stripe Connect account details
 */
export const useStripeAccount = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: STRIPE_QUERY_KEYS.account(),
    queryFn: () => stripeService.getConnectAccount(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000,
    retry: (failureCount, error: any) => {
      // Don't retry if account doesn't exist yet (404)
      if (error?.status === 404) return false;
      return failureCount < 2;
    },
  });
};

/**
 * Hook to fetch Stripe account balance
 */
export const useStripeBalance = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: STRIPE_QUERY_KEYS.balance(),
    queryFn: () => stripeService.getBalance(),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.status === 404) return false;
      return failureCount < 2;
    },
  });
};

/**
 * Hook to fetch checkout session details
 */
export const useCheckoutSession = (sessionId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: STRIPE_QUERY_KEYS.session(sessionId),
    queryFn: () => stripeService.getCheckoutSession(sessionId),
    enabled: !!sessionId && enabled,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch payouts history
 */
export const useStripePayouts = (params?: {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
}) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: STRIPE_QUERY_KEYS.payouts(params),
    queryFn: () => stripeService.getPayouts(params),
    enabled: isAuthenticated,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to fetch transactions history
 */
export const useStripeTransactions = (params?: {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  type?: 'payment' | 'payout' | 'refund' | 'fee';
}) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: STRIPE_QUERY_KEYS.transactions(params),
    queryFn: () => stripeService.getTransactions(params),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to fetch saved payment methods
 */
export const usePaymentMethods = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: STRIPE_QUERY_KEYS.paymentMethods(),
    queryFn: () => stripeService.getPaymentMethods(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

/**
 * Hook to fetch webhook events for debugging
 */
export const useWebhookEvents = (params?: {
  limit?: number;
  starting_after?: string;
  type?: string;
}) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: STRIPE_QUERY_KEYS.webhookEvents(params),
    queryFn: () => stripeService.getWebhookEvents(params),
    enabled: isAuthenticated,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * Mutation hook to create Stripe checkout session
 */
export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: (data: StripeSessionRequest) => stripeService.createCheckoutSession(data),
    onSuccess: (session) => {
      // Redirect to Stripe Checkout
      if (session.url) {
        window.location.href = session.url;
      }
    },
  });
};

/**
 * Mutation hook to create payment intent
 */
export const useCreatePaymentIntent = () => {
  return useMutation({
    mutationFn: (data: PaymentIntentRequest) => stripeService.createPaymentIntent(data),
  });
};

/**
 * Mutation hook to confirm payment intent
 */
export const useConfirmPaymentIntent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentIntentId, paymentMethodId }: {
      paymentIntentId: string;
      paymentMethodId: string;
    }) => stripeService.confirmPaymentIntent(paymentIntentId, paymentMethodId),
    onSuccess: () => {
      // Invalidate balance and transactions on successful payment
      queryClient.invalidateQueries({ queryKey: STRIPE_QUERY_KEYS.balance() });
      queryClient.invalidateQueries({ queryKey: STRIPE_QUERY_KEYS.transactions() });
    },
  });
};

/**
 * Mutation hook to create Stripe Connect account
 */
export const useCreateConnectAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data?: StripeConnectRequest) => stripeService.createConnectAccount(data),
    onSuccess: (response) => {
      // Invalidate account query to refetch updated data
      queryClient.invalidateQueries({ queryKey: STRIPE_QUERY_KEYS.account() });

      // Redirect to Stripe onboarding
      if (response.url) {
        window.location.href = response.url;
      }
    },
  });
};

/**
 * Mutation hook to update Stripe Connect account
 */
export const useUpdateConnectAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: any) => stripeService.updateConnectAccount(updates),
    onSuccess: (updatedAccount) => {
      // Update account in cache
      queryClient.setQueryData(STRIPE_QUERY_KEYS.account(), updatedAccount);
    },
  });
};

/**
 * Mutation hook to create account onboarding link
 */
export const useCreateAccountLink = () => {
  return useMutation({
    mutationFn: () => stripeService.createAccountLink(),
    onSuccess: (response) => {
      // Redirect to Stripe onboarding
      if (response.url) {
        window.location.href = response.url;
      }
    },
  });
};

/**
 * Mutation hook to create login link for Stripe Express dashboard
 */
export const useCreateLoginLink = () => {
  return useMutation({
    mutationFn: () => stripeService.createLoginLink(),
    onSuccess: (response) => {
      // Open Stripe dashboard in new tab
      if (response.url) {
        window.open(response.url, '_blank');
      }
    },
  });
};

/**
 * Mutation hook to create payout
 */
export const useCreatePayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StripePayoutRequest) => stripeService.createPayout(data),
    onSuccess: () => {
      // Invalidate balance and payouts queries
      queryClient.invalidateQueries({ queryKey: STRIPE_QUERY_KEYS.balance() });
      queryClient.invalidateQueries({ queryKey: STRIPE_QUERY_KEYS.payouts() });
      queryClient.invalidateQueries({ queryKey: STRIPE_QUERY_KEYS.transactions() });
    },
  });
};

/**
 * Mutation hook to refund payment
 */
export const useRefundPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      paymentIntentId,
      amount,
      reason,
    }: {
      paymentIntentId: string;
      amount?: number;
      reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer';
    }) => stripeService.refundPayment(paymentIntentId, amount, reason),
    onSuccess: () => {
      // Invalidate balance and transactions
      queryClient.invalidateQueries({ queryKey: STRIPE_QUERY_KEYS.balance() });
      queryClient.invalidateQueries({ queryKey: STRIPE_QUERY_KEYS.transactions() });
    },
  });
};

/**
 * Mutation hook to save payment method
 */
export const useSavePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentMethodId: string) => stripeService.savePaymentMethod(paymentMethodId),
    onSuccess: () => {
      // Invalidate payment methods to refetch updated list
      queryClient.invalidateQueries({ queryKey: STRIPE_QUERY_KEYS.paymentMethods() });
    },
  });
};

/**
 * Mutation hook to delete payment method
 */
export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentMethodId: string) => stripeService.deletePaymentMethod(paymentMethodId),
    onMutate: async (paymentMethodId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: STRIPE_QUERY_KEYS.paymentMethods() });

      // Snapshot previous value
      const previousPaymentMethods = queryClient.getQueryData(STRIPE_QUERY_KEYS.paymentMethods());

      // Optimistically remove payment method
      queryClient.setQueryData(
        STRIPE_QUERY_KEYS.paymentMethods(),
        (old: any) => {
          if (!Array.isArray(old)) return old;
          return old.filter((method: any) => method.id !== paymentMethodId);
        }
      );

      return { previousPaymentMethods };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousPaymentMethods) {
        queryClient.setQueryData(
          STRIPE_QUERY_KEYS.paymentMethods(),
          context.previousPaymentMethods
        );
      }
    },
    onSettled: () => {
      // Always refetch
      queryClient.invalidateQueries({ queryKey: STRIPE_QUERY_KEYS.paymentMethods() });
    },
  });
};

/**
 * Hook for checking Stripe Connect account status
 */
export const useStripeAccountStatus = () => {
  const { data: account, isLoading, error } = useStripeAccount();

  const isConnected = !!account?.id;
  const canReceivePayments = account?.charges_enabled && account?.payouts_enabled;
  const needsOnboarding = !account?.details_submitted;

  return {
    account,
    isLoading,
    error,
    isConnected,
    canReceivePayments,
    needsOnboarding,
    status: {
      charges_enabled: account?.charges_enabled ?? false,
      details_submitted: account?.details_submitted ?? false,
      payouts_enabled: account?.payouts_enabled ?? false,
    },
  };
};

/**
 * Hook for payment processing with error handling
 */
export const usePaymentProcessor = () => {
  const createPaymentIntent = useCreatePaymentIntent();
  const confirmPaymentIntent = useConfirmPaymentIntent();
  const createCheckoutSession = useCreateCheckoutSession();

  const processDirectPayment = async (
    paymentData: PaymentIntentRequest,
    paymentMethodId: string
  ) => {
    try {
      // Create payment intent
      const { client_secret, payment_intent_id } = await createPaymentIntent.mutateAsync(paymentData);

      // Confirm payment intent
      const result = await confirmPaymentIntent.mutateAsync({
        paymentIntentId: payment_intent_id,
        paymentMethodId,
      });

      return result;
    } catch (error) {
      throw error;
    }
  };

  const processCheckoutPayment = async (sessionData: StripeSessionRequest) => {
    try {
      return await createCheckoutSession.mutateAsync(sessionData);
    } catch (error) {
      throw error;
    }
  };

  return {
    processDirectPayment,
    processCheckoutPayment,
    isProcessing: createPaymentIntent.isPending || confirmPaymentIntent.isPending || createCheckoutSession.isPending,
    error: createPaymentIntent.error || confirmPaymentIntent.error || createCheckoutSession.error,
  };
};