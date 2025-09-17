import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthStore, User, LoginCredentials, RegisterCredentials } from '@/types/auth';
import { authAPI, tokenUtils } from '@/lib/api/auth';

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      ...initialState,

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authAPI.login(credentials);
          const { token, user } = response;

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // Store token in localStorage for persistence across tabs
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true, error: null });

        try {
          await authAPI.register(credentials);

          set({
            isLoading: false,
            error: null,
          });

          // Auto-login after successful registration
          await get().login({
            email: credentials.email,
            password: credentials.password,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Registration failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      logout: () => {
        set(initialState);

        // Clear token from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
      },

      setUser: (user: User | null) => {
        set({ user });
      },

      setToken: (token: string | null) => {
        set({ token });

        // Sync with localStorage
        if (typeof window !== 'undefined') {
          if (token) {
            localStorage.setItem('auth_token', token);
          } else {
            localStorage.removeItem('auth_token');
          }
        }
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: () => {
        const { user, token } = get();
        set({ isAuthenticated: !!(user && token) });
      },

      initializeAuth: async () => {
        set({ isLoading: true });

        try {
          // Check for stored token
          const storedToken = typeof window !== 'undefined'
            ? localStorage.getItem('auth_token')
            : null;

          if (storedToken && !get().token) {
            // Try to verify the stored token
            try {
              const response = await authAPI.verifyToken(storedToken);
              set({
                user: response.user,
                token: storedToken,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
            } catch (error) {
              // Token is invalid, clear it
              if (typeof window !== 'undefined') {
                localStorage.removeItem('auth_token');
              }
              set(initialState);
            }
          } else if (get().token) {
            // Token exists in store, verify it's still valid
            try {
              await authAPI.verifyToken(get().token!);
              set({
                isAuthenticated: true,
                isLoading: false,
              });
            } catch (error) {
              // Token is invalid, clear auth state
              get().logout();
            }
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({
            ...initialState,
            error: 'Failed to initialize authentication',
          });
        }
      },
    }),
    {
      name: 'auth-store', // unique name for storage
      storage: createJSONStorage(() => localStorage), // use localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }), // only persist these fields
      onRehydrateStorage: () => (state) => {
        // Re-initialize auth after hydration
        if (state) {
          state.checkAuth();
        }
      },
    }
  )
);

// Selectors for common use cases
export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
  };
};

export const useAuthActions = () => {
  const store = useAuthStore();
  return {
    login: store.login,
    register: store.register,
    logout: store.logout,
    clearError: store.clearError,
    initializeAuth: store.initializeAuth,
  };
};