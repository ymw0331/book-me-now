# React Query Setup

This directory contains the React Query configuration and utilities for the Book Me Now application.

## Files

### `query-client.ts`
Contains the QueryClient configuration with optimized defaults:
- **Stale Time**: 5 minutes for queries
- **Garbage Collection Time**: 10 minutes
- **Retry Logic**: Smart retry with exponential backoff
- **Error Handling**: Automatic retry for network errors, skip 4xx errors
- **Environment-specific**: Different behavior for development vs production

### `hooks/use-properties.ts`
Example custom hooks for property-related API calls:
- `useProperties()` - Fetch all properties
- `useProperty(id)` - Fetch a single property
- `useCreateProperty()` - Create a new property with cache invalidation
- `useSearchProperties(params)` - Search properties with filters

## Usage

### In Components

```tsx
'use client';

import { useProperties, useCreateProperty } from '@/lib/hooks/use-properties';
import { Button } from '@book-me-now/ui';

export function PropertiesList() {
  const { data: properties, isLoading, error } = useProperties();
  const createMutation = useCreateProperty();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {properties?.map(property => (
        <div key={property.id}>{property.title}</div>
      ))}

      <Button
        onClick={() => createMutation.mutate({
          title: 'New Property',
          location: 'New York',
          price: 200
        })}
        disabled={createMutation.isPending}
      >
        {createMutation.isPending ? 'Creating...' : 'Add Property'}
      </Button>
    </div>
  );
}
```

### Key Features

1. **Automatic Caching**: Queries are cached automatically
2. **Background Refetching**: Data stays fresh without user intervention
3. **Optimistic Updates**: UI updates immediately, rolls back on error
4. **Request Deduplication**: Multiple components requesting same data = single request
5. **Error Boundaries**: Graceful error handling
6. **DevTools**: Available in development mode

### Best Practices

1. **Use Query Keys Consistently**: `['entity', 'operation', params]`
2. **Enable Queries Conditionally**: Use `enabled` option when data depends on user input
3. **Invalidate Related Queries**: After mutations, invalidate affected query keys
4. **Handle Loading States**: Always handle `isLoading`, `error`, and `data` states
5. **Optimize Stale Time**: Set appropriate stale times based on data freshness needs

### Development Tools

React Query DevTools are automatically available in development mode. Access them through the floating icon in the bottom-right corner of your browser.