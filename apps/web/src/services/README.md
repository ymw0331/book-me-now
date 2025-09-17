# Service Layer & React Query Hooks

This directory contains a complete service layer and React Query hooks implementation for the Book Me Now application.

## Architecture Overview

The service layer follows a clean architecture pattern with separation of concerns:

- **API Client** (`lib/axios.ts`) - Centralized HTTP client with interceptors
- **Services** (`services/`) - Business logic and API calls
- **Hooks** (`hooks/`) - React Query integration with caching and state management
- **Types** (`types/api.ts`) - TypeScript interfaces for API responses

## Services

### 1. API Service (`api.service.ts`)
Main coordinator service that provides:
- Authentication token management
- Service aggregation
- Batch requests
- Health checks
- Dashboard data fetching

### 2. Auth Service (`auth.service.ts`)
Authentication and user management:
- Login/register/logout
- Token verification
- Profile management
- Password operations
- Email verification

### 3. Properties Service (`properties.service.ts`)
Property/hotel management:
- CRUD operations
- Search with filters
- Image uploads
- Availability checks
- Statistics
- Status management

### 4. Orders Service (`orders.service.ts`)
Booking and order management:
- Create/update bookings
- Order status management
- Conflict checking
- Price calculations
- Reviews
- Statistics

### 5. Stripe Service (`stripe.service.ts`)
Payment processing:
- Checkout sessions
- Payment intents
- Connect account management
- Payouts and transactions
- Payment methods
- Refunds

## React Query Hooks

### Properties Hooks (`useProperties.ts`)
- `useProperties()` - Fetch properties with pagination
- `useProperty(id)` - Single property details
- `useSearchProperties(params)` - Search with filters
- `useInfiniteSearchProperties()` - Infinite scroll search
- `useUserProperties()` - Current user's properties
- `useFeaturedProperties()` - Featured listings
- `useCreateProperty()` - Create new property
- `useUpdateProperty()` - Update property
- `useDeleteProperty()` - Delete property

### Orders Hooks (`useOrders.ts`)
- `useOrders()` - Fetch orders with filters
- `useOrder(id)` - Single order details
- `useUserOrders()` - User's bookings
- `useHostOrders()` - Host's received bookings
- `useCreateOrder()` - Create booking
- `useCancelOrder()` - Cancel booking
- `useConfirmOrder()` - Confirm booking (host)
- `useOrderStats()` - Booking statistics

### Stripe Hooks (`useStripe.ts`)
- `useStripeAccount()` - Connect account details
- `useStripeBalance()` - Account balance
- `useCreateCheckoutSession()` - Payment checkout
- `useCreatePaymentIntent()` - Direct payments
- `useStripePayouts()` - Payout history
- `useCreatePayout()` - Create payout
- `usePaymentProcessor()` - Unified payment processing

### Search Hooks (`useSearch.ts`)
- `usePropertySearch()` - Advanced search with debouncing
- `useQuickSearch()` - Simple location search
- `useRecentSearches()` - Search history
- `usePopularSearches()` - Popular search terms
- `useDebounce()` - Generic debounce utility

### Auth Hooks (`useAuth.ts`)
Enhanced from existing implementation:
- `useAuth()` - Main auth state and actions
- `useCurrentUser()` - User profile with caching
- `useTokenVerification()` - Token validation
- `useAuthGuard()` - Route protection
- `useAuthForm()` - Form state management

## Features

### Caching Strategy
- **Stale time**: How long data is considered fresh
- **GC time**: How long data stays in cache when unused
- **Optimistic updates**: Immediate UI updates for mutations
- **Cache invalidation**: Smart cache management on mutations

### Error Handling
- Centralized error handling in axios interceptors
- Automatic token refresh on 401 errors
- Graceful error recovery
- User-friendly error messages

### Performance Optimizations
- Request debouncing for search
- Infinite scroll pagination
- Optimistic updates
- Background refetching
- Cache deduplication

### Type Safety
- Full TypeScript integration
- API response typing
- Hook parameter validation
- IDE autocomplete support

## Usage Examples

### Basic Property Search
```typescript
import { usePropertySearch } from '@/hooks';

const SearchComponent = () => {
  const {
    results,
    isLoading,
    setLocation,
    setPriceRange,
    resetFilters
  } = usePropertySearch();

  return (
    // Search UI implementation
  );
};
```

### Creating a Booking
```typescript
import { useCreateOrder } from '@/hooks';

const BookingComponent = () => {
  const createOrder = useCreateOrder();

  const handleBooking = async () => {
    try {
      await createOrder.mutateAsync({
        hotel: propertyId,
        booking: {
          checkIn: '2024-01-01',
          checkOut: '2024-01-05',
          guests: 2,
          totalAmount: 500,
        },
      });
    } catch (error) {
      // Handle error
    }
  };
};
```

### Stripe Payment
```typescript
import { usePaymentProcessor } from '@/hooks';

const PaymentComponent = () => {
  const { processCheckoutPayment, isProcessing } = usePaymentProcessor();

  const handlePayment = async () => {
    await processCheckoutPayment({
      hotelId: propertyId,
    });
  };
};
```

## Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Query Client Setup
The hooks expect React Query to be configured in your app:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { apiService } from '@/services';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes
    },
  },
});

// Initialize API service
apiService.initialize();
```

## Integration with Existing Code

The service layer integrates seamlessly with your existing:
- Auth store (Zustand)
- API routes
- Component structure
- Type definitions

All existing functionality is preserved while adding comprehensive caching, error handling, and performance optimizations.