import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore, useAuth as useAuthState, useAuthActions } from '@/stores/useAuthStore';
import { LoginCredentials, RegisterCredentials } from '@/types/auth';
import { authAPI } from '@/lib/api/auth';
import { useEffect } from 'react';

// Query keys for React Query
export const AUTH_QUERY_KEYS = {
  user: ['auth', 'user'] as const,
  verify: ['auth', 'verify'] as const,
} as const;

/**
 * Main auth hook that combines Zustand store with React Query
 * Provides authentication state and mutations
 */
export const useAuth = () => {
  const authState = useAuthState();
  const actions = useAuthActions();
  const queryClient = useQueryClient();

  // Initialize auth on mount
  useEffect(() => {
    actions.initializeAuth();
  }, [actions]);

  // Login mutation with React Query
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      await actions.login(credentials);
    },
    onSuccess: () => {
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.user });
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.verify });
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });

  // Register mutation with React Query
  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      await actions.register(credentials);
    },
    onSuccess: () => {
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.user });
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.verify });
    },
    onError: (error) => {
      console.error('Registration error:', error);
    },
  });

  // Logout function with query cleanup
  const logout = () => {
    actions.logout();
    // Clear all queries when logging out
    queryClient.clear();
  };

  return {
    // Auth state
    ...authState,

    // Mutation states
    isLoginPending: loginMutation.isPending,
    isRegisterPending: registerMutation.isPending,
    loginError: loginMutation.error?.message || null,
    registerError: registerMutation.error?.message || null,

    // Actions
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    logout,
    clearError: actions.clearError,

    // Utility functions
    reset: () => {
      loginMutation.reset();
      registerMutation.reset();
      actions.clearError();
    },
  };
};

/**
 * Hook for getting current user data with React Query caching
 */
export const useCurrentUser = () => {
  const { user, token, isAuthenticated } = useAuthState();

  return useQuery({
    queryKey: AUTH_QUERY_KEYS.user,
    queryFn: () => user,
    enabled: isAuthenticated && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: false,
    initialData: user,
  });
};

/**
 * Hook for token verification with React Query
 */
export const useTokenVerification = () => {
  const { token } = useAuthState();
  const actions = useAuthActions();

  return useQuery({
    queryKey: [...AUTH_QUERY_KEYS.verify, token],
    queryFn: async () => {
      if (!token) throw new Error('No token available');

      return await authAPI.verifyToken(token);
    },
    enabled: !!token,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 1,
    onError: () => {
      // If token verification fails, logout the user
      actions.logout();
    },
  });
};

/**
 * Hook for authentication guards in protected routes
 */
export const useAuthGuard = () => {
  const { isAuthenticated, isLoading, user } = useAuthState();

  return {
    isAuthenticated,
    isLoading,
    user,
    canAccess: isAuthenticated && !!user,
    requiresAuth: !isAuthenticated || !user,
  };
};

/**
 * Hook for form state management with auth operations
 */
export const useAuthForm = () => {
  const {
    login,
    register,
    isLoginPending,
    isRegisterPending,
    loginError,
    registerError,
    clearError,
    reset,
  } = useAuth();

  return {
    // Form actions
    handleLogin: login,
    handleRegister: register,

    // Loading states
    isLoginLoading: isLoginPending,
    isRegisterLoading: isRegisterPending,
    isLoading: isLoginPending || isRegisterPending,

    // Error states
    loginError,
    registerError,
    hasError: !!(loginError || registerError),

    // Utilities
    clearError,
    resetForm: reset,
  };
};

/**
 * Higher-order hook for components that need auth state
 */
export const withAuth = <T extends object>(
  component: (props: T & { auth: ReturnType<typeof useAuth> }) => JSX.Element
) => {
  return (props: T) => {
    const auth = useAuth();
    return component({ ...props, auth });
  };
};

// Export the store directly for advanced use cases
export { useAuthStore } from '@/stores/useAuthStore';