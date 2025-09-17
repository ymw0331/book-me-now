import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import {
  ordersService,
  OrderSearchParams,
  CreateBookingRequest,
  UpdateOrderRequest,
} from '@/services/orders.service';
import { Order } from '@/types/api';
import { useAuth } from './useAuth';

// Query keys for React Query
export const ORDERS_QUERY_KEYS = {
  all: ['orders'] as const,
  lists: () => [...ORDERS_QUERY_KEYS.all, 'list'] as const,
  list: (params?: any) => [...ORDERS_QUERY_KEYS.lists(), params] as const,
  details: () => [...ORDERS_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ORDERS_QUERY_KEYS.details(), id] as const,
  user: () => [...ORDERS_QUERY_KEYS.all, 'user'] as const,
  userList: (params?: any) => [...ORDERS_QUERY_KEYS.user(), params] as const,
  host: () => [...ORDERS_QUERY_KEYS.all, 'host'] as const,
  hostList: (params?: any) => [...ORDERS_QUERY_KEYS.host(), params] as const,
  stats: (timeframe?: string) => [...ORDERS_QUERY_KEYS.all, 'stats', timeframe] as const,
  upcoming: (limit?: number) => [...ORDERS_QUERY_KEYS.all, 'upcoming', limit] as const,
  history: (params?: any) => [...ORDERS_QUERY_KEYS.all, 'history', params] as const,
  conflicts: (propertyId: string, checkIn: string, checkOut: string, excludeOrderId?: string) =>
    [...ORDERS_QUERY_KEYS.all, 'conflicts', propertyId, checkIn, checkOut, excludeOrderId] as const,
  calculateTotal: (propertyId: string, checkIn: string, checkOut: string, guests: number) =>
    [...ORDERS_QUERY_KEYS.all, 'calculate-total', propertyId, checkIn, checkOut, guests] as const,
  review: (orderId: string) => [...ORDERS_QUERY_KEYS.detail(orderId), 'review'] as const,
} as const;

/**
 * Hook to fetch all orders with filtering and pagination
 */
export const useOrders = (params?: OrderSearchParams) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ORDERS_QUERY_KEYS.list(params),
    queryFn: () => ordersService.getOrders(params),
    enabled: isAuthenticated,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to fetch a single order by ID
 */
export const useOrder = (id: string, enabled: boolean = true) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ORDERS_QUERY_KEYS.detail(id),
    queryFn: () => ordersService.getOrder(id),
    enabled: !!id && isAuthenticated && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

/**
 * Hook to fetch user's orders (as guest)
 */
export const useUserOrders = (params?: OrderSearchParams) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ORDERS_QUERY_KEYS.userList(params),
    queryFn: () => ordersService.getUserOrders(params),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook for infinite scrolling user orders
 */
export const useInfiniteUserOrders = (params?: Omit<OrderSearchParams, 'page'>) => {
  const { isAuthenticated } = useAuth();

  return useInfiniteQuery({
    queryKey: [...ORDERS_QUERY_KEYS.userList(params), 'infinite'],
    queryFn: ({ pageParam = 1 }) =>
      ordersService.getUserOrders({ ...params, page: pageParam }),
    enabled: isAuthenticated,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination) return undefined;
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to fetch host orders (for property owners)
 */
export const useHostOrders = (params?: OrderSearchParams) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ORDERS_QUERY_KEYS.hostList(params),
    queryFn: () => ordersService.getHostOrders(params),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook for infinite scrolling host orders
 */
export const useInfiniteHostOrders = (params?: Omit<OrderSearchParams, 'page'>) => {
  const { isAuthenticated } = useAuth();

  return useInfiniteQuery({
    queryKey: [...ORDERS_QUERY_KEYS.hostList(params), 'infinite'],
    queryFn: ({ pageParam = 1 }) =>
      ordersService.getHostOrders({ ...params, page: pageParam }),
    enabled: isAuthenticated,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination) return undefined;
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to fetch order statistics
 */
export const useOrderStats = (timeframe?: 'week' | 'month' | 'year') => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ORDERS_QUERY_KEYS.stats(timeframe),
    queryFn: () => ordersService.getOrderStats(timeframe),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

/**
 * Hook to fetch upcoming bookings
 */
export const useUpcomingBookings = (limit: number = 5) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ORDERS_QUERY_KEYS.upcoming(limit),
    queryFn: () => ordersService.getUpcomingBookings(limit),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to fetch booking history
 */
export const useBookingHistory = (params?: {
  page?: number;
  limit?: number;
  year?: number;
}) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ORDERS_QUERY_KEYS.history(params),
    queryFn: () => ordersService.getBookingHistory(params),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
};

/**
 * Hook to check booking conflicts
 */
export const useBookingConflicts = (
  propertyId: string,
  checkIn: string,
  checkOut: string,
  excludeOrderId?: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ORDERS_QUERY_KEYS.conflicts(propertyId, checkIn, checkOut, excludeOrderId),
    queryFn: () => ordersService.checkBookingConflicts(propertyId, checkIn, checkOut, excludeOrderId),
    enabled: !!propertyId && !!checkIn && !!checkOut && enabled,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000,
  });
};

/**
 * Hook to calculate booking total
 */
export const useCalculateBookingTotal = (
  propertyId: string,
  checkIn: string,
  checkOut: string,
  guests: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ORDERS_QUERY_KEYS.calculateTotal(propertyId, checkIn, checkOut, guests),
    queryFn: () => ordersService.calculateBookingTotal(propertyId, checkIn, checkOut, guests),
    enabled: !!propertyId && !!checkIn && !!checkOut && guests > 0 && enabled,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch order review
 */
export const useOrderReview = (orderId: string, enabled: boolean = true) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ORDERS_QUERY_KEYS.review(orderId),
    queryFn: () => ordersService.getOrderReview(orderId),
    enabled: !!orderId && isAuthenticated && enabled,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

/**
 * Mutation hook to create a new order/booking
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingRequest) => ordersService.createOrder(data),
    onSuccess: (newOrder) => {
      // Invalidate orders lists
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.user() });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.host() });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.upcoming() });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.all });

      // Add new order to cache
      queryClient.setQueryData(
        ORDERS_QUERY_KEYS.detail(newOrder._id),
        newOrder
      );

      // Optimistically update user orders list
      queryClient.setQueryData(
        ORDERS_QUERY_KEYS.userList(),
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: [newOrder, ...(oldData.data || [])],
          };
        }
      );
    },
  });
};

/**
 * Mutation hook to update an existing order
 */
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateOrderRequest }) =>
      ordersService.updateOrder(id, updates),
    onSuccess: (updatedOrder) => {
      // Update order in cache
      queryClient.setQueryData(
        ORDERS_QUERY_KEYS.detail(updatedOrder._id),
        updatedOrder
      );

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.user() });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.host() });

      // Update order in lists cache
      queryClient.setQueriesData(
        { queryKey: ORDERS_QUERY_KEYS.lists() },
        (oldData: any) => {
          if (!oldData?.data) return oldData;
          const updatedData = oldData.data.map((order: Order) =>
            order._id === updatedOrder._id ? updatedOrder : order
          );
          return { ...oldData, data: updatedData };
        }
      );
    },
  });
};

/**
 * Mutation hook to cancel an order
 */
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      ordersService.cancelOrder(id, reason),
    onMutate: async ({ id }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ORDERS_QUERY_KEYS.detail(id) });

      // Snapshot previous value
      const previousOrder = queryClient.getQueryData(ORDERS_QUERY_KEYS.detail(id));

      // Optimistically update
      queryClient.setQueryData(
        ORDERS_QUERY_KEYS.detail(id),
        (old: any) => old ? { ...old, status: 'cancelled' } : old
      );

      return { previousOrder };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousOrder) {
        queryClient.setQueryData(
          ORDERS_QUERY_KEYS.detail(variables.id),
          context.previousOrder
        );
      }
    },
    onSuccess: (cancelledOrder) => {
      // Update order in cache
      queryClient.setQueryData(
        ORDERS_QUERY_KEYS.detail(cancelledOrder._id),
        cancelledOrder
      );

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.user() });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.host() });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.upcoming() });
    },
  });
};

/**
 * Mutation hook to confirm an order (for hosts)
 */
export const useConfirmOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ordersService.confirmOrder(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ORDERS_QUERY_KEYS.detail(id) });

      const previousOrder = queryClient.getQueryData(ORDERS_QUERY_KEYS.detail(id));

      queryClient.setQueryData(
        ORDERS_QUERY_KEYS.detail(id),
        (old: any) => old ? { ...old, status: 'confirmed' } : old
      );

      return { previousOrder };
    },
    onError: (err, variables, context) => {
      if (context?.previousOrder) {
        queryClient.setQueryData(
          ORDERS_QUERY_KEYS.detail(variables),
          context.previousOrder
        );
      }
    },
    onSuccess: (confirmedOrder) => {
      queryClient.setQueryData(
        ORDERS_QUERY_KEYS.detail(confirmedOrder._id),
        confirmedOrder
      );

      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.host() });
    },
  });
};

/**
 * Mutation hook to complete an order
 */
export const useCompleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ordersService.completeOrder(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ORDERS_QUERY_KEYS.detail(id) });

      const previousOrder = queryClient.getQueryData(ORDERS_QUERY_KEYS.detail(id));

      queryClient.setQueryData(
        ORDERS_QUERY_KEYS.detail(id),
        (old: any) => old ? { ...old, status: 'completed' } : old
      );

      return { previousOrder };
    },
    onError: (err, variables, context) => {
      if (context?.previousOrder) {
        queryClient.setQueryData(
          ORDERS_QUERY_KEYS.detail(variables),
          context.previousOrder
        );
      }
    },
    onSuccess: (completedOrder) => {
      queryClient.setQueryData(
        ORDERS_QUERY_KEYS.detail(completedOrder._id),
        completedOrder
      );

      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.host() });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.upcoming() });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.all });
    },
  });
};

/**
 * Mutation hook to add a review for an order
 */
export const useAddOrderReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      review,
    }: {
      orderId: string;
      review: {
        rating: number;
        comment: string;
        cleanliness?: number;
        accuracy?: number;
        checkin?: number;
        communication?: number;
        location?: number;
        value?: number;
      };
    }) => ordersService.addOrderReview(orderId, review),
    onSuccess: (_, { orderId }) => {
      // Invalidate review query to refetch
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.review(orderId) });

      // Invalidate order details to show review status
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.detail(orderId) });
    },
  });
};