'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { User } from '@/types/auth';

// Auth Context for SSR/hydration safety
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth Provider component for Next.js App Router
 * Handles auth state initialization and hydration
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    initializeAuth,
  } = useAuthStore();

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Create context value
  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    isInitialized: true, // Since we're on client side
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context
 * Provides a safer alternative to direct store access
 */
export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
}

/**
 * Higher-Order Component for auth protection
 */
export function withAuthProvider<P extends object>(
  Component: React.ComponentType<P>
) {
  return function WrappedComponent(props: P) {
    return (
      <AuthProvider>
        <Component {...props} />
      </AuthProvider>
    );
  };
}

/**
 * Auth Guard component for protected routes
 */
interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

export function AuthGuard({
  children,
  fallback = <div>Please log in to access this page.</div>,
  redirectTo,
  requireAuth = true,
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuthContext();

  // Show loading state during initialization
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Handle redirect if specified
  useEffect(() => {
    if (requireAuth && !isAuthenticated && redirectTo && typeof window !== 'undefined') {
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, redirectTo, requireAuth]);

  // Show fallback if auth is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>;
  }

  // Show fallback if auth is not required but we want to hide content for authenticated users
  if (!requireAuth && isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Component for conditionally rendering content based on auth state
 */
interface AuthConditionalProps {
  children: ReactNode;
  fallback?: ReactNode;
  when: 'authenticated' | 'unauthenticated' | 'loading';
}

export function AuthConditional({ children, fallback = null, when }: AuthConditionalProps) {
  const { isAuthenticated, isLoading } = useAuthContext();

  const shouldRender =
    (when === 'authenticated' && isAuthenticated) ||
    (when === 'unauthenticated' && !isAuthenticated) ||
    (when === 'loading' && isLoading);

  return shouldRender ? <>{children}</> : <>{fallback}</>;
}

/**
 * Hook for authentication-based navigation
 */
export function useAuthNavigation() {
  const { isAuthenticated, user } = useAuthContext();

  const navigateToLogin = (returnUrl?: string) => {
    const url = returnUrl
      ? `/login?returnUrl=${encodeURIComponent(returnUrl)}`
      : '/login';

    if (typeof window !== 'undefined') {
      window.location.href = url;
    }
  };

  const navigateToRegister = (returnUrl?: string) => {
    const url = returnUrl
      ? `/register?returnUrl=${encodeURIComponent(returnUrl)}`
      : '/register';

    if (typeof window !== 'undefined') {
      window.location.href = url;
    }
  };

  const navigateToDashboard = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
  };

  return {
    navigateToLogin,
    navigateToRegister,
    navigateToDashboard,
    isAuthenticated,
    user,
  };
}