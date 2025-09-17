# Authentication System Documentation

This comprehensive auth system uses Zustand for state management, React Query for API caching, and provides TypeScript support for the Book Me Now application.

## Overview

The auth system provides:
- ✅ Zustand store for state management with persistence
- ✅ React Query integration for optimistic updates and caching
- ✅ TypeScript-first design with comprehensive type safety
- ✅ JWT token management with automatic persistence
- ✅ Next.js 15 App Router compatibility
- ✅ Auth guards and protected route components
- ✅ Comprehensive error handling
- ✅ Token verification and auto-refresh capabilities

## Architecture

```
src/
├── types/auth.ts           # TypeScript interfaces and types
├── stores/useAuthStore.ts  # Zustand store with persistence
├── hooks/useAuth.ts        # React Query + Zustand integration
├── lib/api/auth.ts         # API service functions
├── providers/AuthProvider.tsx # React context and guards
└── lib/auth/README.md      # This documentation
```

## Setup

### 1. Environment Variables

Add to your `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
# Add your backend API URL
```

### 2. App Router Integration

Update your `app/layout.tsx`:

```tsx
import { AuthProvider } from '@/providers/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

### 3. API Endpoint Requirements

Your backend should implement these endpoints:

```javascript
// Expected API endpoints
POST /register    // Register new user
POST /login       // Authenticate user
GET  /verify-token // Verify JWT token
GET  /me          // Get current user
PUT  /me          // Update user profile
POST /logout      // Logout (optional)
```

## Usage Examples

### Basic Authentication

```tsx
'use client';

import { useAuth } from '@/hooks/useAuth';

export default function LoginForm() {
  const {
    login,
    isLoginPending,
    loginError,
    isAuthenticated,
    user,
  } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    try {
      await login({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      });
      // Login successful - user will be redirected by auth state
    } catch (error) {
      // Error is automatically handled by the hook
      console.error('Login failed:', error);
    }
  };

  if (isAuthenticated) {
    return <div>Welcome, {user?.name}!</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
      />
      <button
        type="submit"
        disabled={isLoginPending}
      >
        {isLoginPending ? 'Logging in...' : 'Login'}
      </button>

      {loginError && (
        <div className="error">
          {loginError}
        </div>
      )}
    </form>
  );
}
```

### Registration Form

```tsx
'use client';

import { useAuth } from '@/hooks/useAuth';

export default function RegisterForm() {
  const {
    register,
    isRegisterPending,
    registerError,
  } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    try {
      await register({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      });
      // Registration successful - user will be auto-logged in
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        type="text"
        placeholder="Full Name"
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        minLength={6}
        required
      />
      <button
        type="submit"
        disabled={isRegisterPending}
      >
        {isRegisterPending ? 'Creating Account...' : 'Register'}
      </button>

      {registerError && (
        <div className="error">
          {registerError}
        </div>
      )}
    </form>
  );
}
```

### Protected Routes

```tsx
import { AuthGuard } from '@/providers/AuthProvider';

export default function DashboardPage() {
  return (
    <AuthGuard
      fallback={
        <div>
          <h1>Access Denied</h1>
          <p>Please log in to view your dashboard.</p>
        </div>
      }
      redirectTo="/login"
    >
      <div>
        <h1>Dashboard</h1>
        <p>Welcome to your private dashboard!</p>
      </div>
    </AuthGuard>
  );
}
```

### Conditional Rendering

```tsx
import { AuthConditional } from '@/providers/AuthProvider';

export default function Header() {
  return (
    <header>
      <nav>
        <AuthConditional when="authenticated">
          <UserMenu />
        </AuthConditional>

        <AuthConditional
          when="unauthenticated"
          fallback={null}
        >
          <div>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </div>
        </AuthConditional>

        <AuthConditional when="loading">
          <div>Loading...</div>
        </AuthConditional>
      </nav>
    </header>
  );
}
```

### User Profile Component

```tsx
'use client';

import { useCurrentUser } from '@/hooks/useAuth';

export default function UserProfile() {
  const { data: user, isLoading, error } = useCurrentUser();

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>Error loading profile: {error.message}</div>;
  }

  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <div>
      <h2>Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>

      {user.stripe_account_id && (
        <p>Stripe Account: Connected</p>
      )}
    </div>
  );
}
```

### Logout Button

```tsx
'use client';

import { useAuth } from '@/hooks/useAuth';

export default function LogoutButton() {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    // User will be automatically redirected based on your app's routing
  };

  if (!user) return null;

  return (
    <button
      onClick={handleLogout}
      className="btn btn-outline"
    >
      Logout
    </button>
  );
}
```

## Advanced Usage

### Custom Auth Hook for Forms

```tsx
import { useAuthForm } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdvancedLoginForm() {
  const {
    handleLogin,
    isLoginLoading,
    loginError,
    clearError,
  } = useAuthForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    try {
      await handleLogin(data);
    } catch (error) {
      // Error is handled by the auth system
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          {...register('email')}
          type="email"
          placeholder="Email"
        />
        {errors.email && (
          <span className="error">{errors.email.message}</span>
        )}
      </div>

      <div>
        <input
          {...register('password')}
          type="password"
          placeholder="Password"
        />
        {errors.password && (
          <span className="error">{errors.password.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoginLoading}
      >
        {isLoginLoading ? 'Logging in...' : 'Login'}
      </button>

      {loginError && (
        <div className="error">
          {loginError}
        </div>
      )}
    </form>
  );
}
```

### Direct Store Access

```tsx
import { useAuthStore } from '@/stores/useAuthStore';

export default function DirectStoreExample() {
  // Direct access to the store for advanced use cases
  const {
    user,
    token,
    isAuthenticated,
    setUser,
    setToken,
    clearError,
  } = useAuthStore();

  // Custom logic with direct store manipulation
  const customAuthLogic = () => {
    if (user && !user.stripe_account_id) {
      // Custom logic for users without Stripe accounts
    }
  };

  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
}
```

## API Reference

### Types

See `/src/types/auth.ts` for complete type definitions.

### Hooks

- `useAuth()` - Main auth hook with React Query integration
- `useCurrentUser()` - Get current user with caching
- `useTokenVerification()` - Verify token validity
- `useAuthGuard()` - Auth status for route protection
- `useAuthForm()` - Form-specific auth operations

### Store

- `useAuthStore()` - Direct Zustand store access
- `useAuth()` - Selector for auth state only
- `useAuthActions()` - Selector for actions only

### Components

- `AuthProvider` - Context provider
- `AuthGuard` - Route protection
- `AuthConditional` - Conditional rendering

## Error Handling

The auth system provides comprehensive error handling:

```tsx
import { isAuthError } from '@/lib/api/auth';

try {
  await login(credentials);
} catch (error) {
  if (isAuthError(error)) {
    console.error('Auth error:', error.message, error.status);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Testing

```tsx
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';

test('should login user successfully', async () => {
  const { result } = renderHook(() => useAuth());

  await act(async () => {
    await result.current.login({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  expect(result.current.isAuthenticated).toBe(true);
  expect(result.current.user).toBeDefined();
});
```

## Migration from Legacy

If migrating from the legacy MERN auth system:

1. Replace direct API calls with the new auth hooks
2. Update component state management to use Zustand store
3. Replace manual token storage with automatic persistence
4. Update route protection to use `AuthGuard` components

## Troubleshooting

### Common Issues

1. **Token not persisting**: Ensure localStorage is available and AuthProvider is properly set up
2. **API errors**: Check NEXT_PUBLIC_API_URL environment variable
3. **Hydration errors**: Use 'use client' directive for auth-dependent components
4. **TypeScript errors**: Ensure all auth types are properly imported

### Debug Mode

Enable React Query DevTools for debugging:

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Add to your app
<ReactQueryDevtools initialIsOpen={false} />
```

## Best Practices

1. Always use the provided hooks instead of direct store access
2. Handle loading states appropriately in UI components
3. Use AuthGuard for route protection rather than manual checks
4. Clear sensitive data on logout
5. Implement proper error boundaries for auth errors
6. Use TypeScript types for all auth-related data

This auth system provides a robust, type-safe, and modern authentication solution for your Next.js 15 application.