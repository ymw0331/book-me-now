import { QueryClient } from '@tanstack/react-query';

// Create a function to create a new QueryClient instance
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Time in milliseconds that unused/inactive cache data remains in memory
        staleTime: 1000 * 60 * 5, // 5 minutes
        // Time in milliseconds that cache data remains in memory before being garbage collected
        gcTime: 1000 * 60 * 10, // 10 minutes (was cacheTime in v4)
        // Retry failed requests
        retry: (failureCount, error: any) => {
          // Don't retry for 4xx errors except 429 (rate limit)
          if (error?.response?.status >= 400 && error?.response?.status < 500 && error?.response?.status !== 429) {
            return false;
          }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
        // Retry delay with exponential backoff
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Refetch on window focus only in production
        refetchOnWindowFocus: process.env.NODE_ENV === 'production',
        // Don't refetch on reconnect in development
        refetchOnReconnect: process.env.NODE_ENV === 'production',
      },
      mutations: {
        // Retry failed mutations once
        retry: 1,
        // Retry delay for mutations
        retryDelay: 1000,
        // Global error handler for mutations
        onError: (error: any) => {
          console.error('Mutation error:', error);
          // You can add global error handling here (e.g., toast notifications)
        },
      },
    },
  });
}

// Create a singleton QueryClient instance for the app
let clientSingleton: QueryClient | undefined = undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    // Server: always create a new client
    return createQueryClient();
  }

  // Browser: create a new client if we don't have one, or return the existing one
  if (!clientSingleton) {
    clientSingleton = createQueryClient();
  }

  return clientSingleton;
}