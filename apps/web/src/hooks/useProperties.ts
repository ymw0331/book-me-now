import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { propertiesService, PropertySearchParams } from '@/services/properties.service';
import { Property, CreatePropertyRequest, UpdatePropertyRequest } from '@/types/api';
import { useAuth } from './useAuth';

// Query keys for React Query
export const PROPERTIES_QUERY_KEYS = {
  all: ['properties'] as const,
  lists: () => [...PROPERTIES_QUERY_KEYS.all, 'list'] as const,
  list: (params?: any) => [...PROPERTIES_QUERY_KEYS.lists(), params] as const,
  details: () => [...PROPERTIES_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PROPERTIES_QUERY_KEYS.details(), id] as const,
  search: (params: PropertySearchParams) => [...PROPERTIES_QUERY_KEYS.all, 'search', params] as const,
  user: () => [...PROPERTIES_QUERY_KEYS.all, 'user'] as const,
  userList: (params?: any) => [...PROPERTIES_QUERY_KEYS.user(), params] as const,
  featured: () => [...PROPERTIES_QUERY_KEYS.all, 'featured'] as const,
  nearby: (id: string, radius?: number) => [...PROPERTIES_QUERY_KEYS.all, 'nearby', id, radius] as const,
  stats: (id: string) => [...PROPERTIES_QUERY_KEYS.detail(id), 'stats'] as const,
  availability: (id: string, from: string, to: string) =>
    [...PROPERTIES_QUERY_KEYS.detail(id), 'availability', from, to] as const,
} as const;

/**
 * Hook to fetch all properties with pagination and sorting
 */
export const useProperties = (params?: {
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'createdAt' | 'title' | 'bed';
  sortOrder?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: PROPERTIES_QUERY_KEYS.list(params),
    queryFn: () => propertiesService.getProperties(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch a single property by ID
 */
export const useProperty = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: PROPERTIES_QUERY_KEYS.detail(id),
    queryFn: () => propertiesService.getProperty(id),
    enabled: !!id && enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook to search properties with filters
 */
export const useSearchProperties = (searchParams: PropertySearchParams) => {
  const hasSearchParams = Object.values(searchParams).some(
    value => value !== undefined && value !== '' && value !== null
  );

  return useQuery({
    queryKey: PROPERTIES_QUERY_KEYS.search(searchParams),
    queryFn: () => propertiesService.searchProperties(searchParams),
    enabled: hasSearchParams,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for infinite scrolling properties search
 */
export const useInfiniteSearchProperties = (searchParams: Omit<PropertySearchParams, 'page'>) => {
  const hasSearchParams = Object.values(searchParams).some(
    value => value !== undefined && value !== '' && value !== null
  );

  return useInfiniteQuery({
    queryKey: [...PROPERTIES_QUERY_KEYS.search(searchParams), 'infinite'],
    queryFn: ({ pageParam = 1 }) =>
      propertiesService.searchProperties({ ...searchParams, page: pageParam }),
    enabled: hasSearchParams,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination) return undefined;
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch user's properties
 */
export const useUserProperties = (params?: {
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'createdAt' | 'title' | 'bed';
  sortOrder?: 'asc' | 'desc';
}) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: PROPERTIES_QUERY_KEYS.userList(params),
    queryFn: () => propertiesService.getUserProperties(params),
    enabled: isAuthenticated,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to fetch featured properties
 */
export const useFeaturedProperties = (limit: number = 6) => {
  return useQuery({
    queryKey: [...PROPERTIES_QUERY_KEYS.featured(), limit],
    queryFn: () => propertiesService.getFeaturedProperties(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000,
  });
};

/**
 * Hook to fetch nearby properties
 */
export const useNearbyProperties = (
  propertyId: string,
  radius: number = 10,
  limit: number = 6,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [...PROPERTIES_QUERY_KEYS.nearby(propertyId, radius), limit],
    queryFn: () => propertiesService.getNearbyProperties(propertyId, radius, limit),
    enabled: !!propertyId && enabled,
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
};

/**
 * Hook to check property availability
 */
export const usePropertyAvailability = (
  propertyId: string,
  from: string,
  to: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: PROPERTIES_QUERY_KEYS.availability(propertyId, from, to),
    queryFn: () => propertiesService.checkAvailability(propertyId, from, to),
    enabled: !!propertyId && !!from && !!to && enabled,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch property statistics
 */
export const usePropertyStats = (propertyId: string, enabled: boolean = true) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: PROPERTIES_QUERY_KEYS.stats(propertyId),
    queryFn: () => propertiesService.getPropertyStats(propertyId),
    enabled: !!propertyId && isAuthenticated && enabled,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

/**
 * Mutation hook to create a new property
 */
export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePropertyRequest) => propertiesService.createProperty(data),
    onSuccess: (newProperty) => {
      // Invalidate properties lists
      queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEYS.user() });

      // Add the new property to cache
      queryClient.setQueryData(
        PROPERTIES_QUERY_KEYS.detail(newProperty._id),
        newProperty
      );

      // Optimistically update user properties list
      queryClient.setQueryData(
        PROPERTIES_QUERY_KEYS.userList(),
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: [newProperty, ...(oldData.data || [])],
          };
        }
      );
    },
  });
};

/**
 * Mutation hook to update an existing property
 */
export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdatePropertyRequest }) =>
      propertiesService.updateProperty(id, updates),
    onSuccess: (updatedProperty) => {
      // Update property in cache
      queryClient.setQueryData(
        PROPERTIES_QUERY_KEYS.detail(updatedProperty._id),
        updatedProperty
      );

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEYS.user() });

      // Update property in lists cache
      queryClient.setQueriesData(
        { queryKey: PROPERTIES_QUERY_KEYS.lists() },
        (oldData: any) => {
          if (!oldData?.data) return oldData;
          const updatedData = oldData.data.map((property: Property) =>
            property._id === updatedProperty._id ? updatedProperty : property
          );
          return { ...oldData, data: updatedData };
        }
      );
    },
  });
};

/**
 * Mutation hook to delete a property
 */
export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => propertiesService.deleteProperty(id),
    onSuccess: (_, deletedId) => {
      // Remove property from cache
      queryClient.removeQueries({ queryKey: PROPERTIES_QUERY_KEYS.detail(deletedId) });

      // Invalidate and update lists
      queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEYS.user() });

      // Optimistically remove from lists cache
      queryClient.setQueriesData(
        { queryKey: PROPERTIES_QUERY_KEYS.lists() },
        (oldData: any) => {
          if (!oldData?.data) return oldData;
          const filteredData = oldData.data.filter((property: Property) => property._id !== deletedId);
          return { ...oldData, data: filteredData };
        }
      );
    },
  });
};

/**
 * Mutation hook to toggle property status
 */
export const useTogglePropertyStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, active }: { propertyId: string; active: boolean }) =>
      propertiesService.togglePropertyStatus(propertyId, active),
    onMutate: async ({ propertyId, active }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: PROPERTIES_QUERY_KEYS.detail(propertyId) });

      // Snapshot previous value
      const previousProperty = queryClient.getQueryData(PROPERTIES_QUERY_KEYS.detail(propertyId));

      // Optimistically update
      queryClient.setQueryData(
        PROPERTIES_QUERY_KEYS.detail(propertyId),
        (old: any) => old ? { ...old, active } : old
      );

      return { previousProperty };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousProperty) {
        queryClient.setQueryData(
          PROPERTIES_QUERY_KEYS.detail(variables.propertyId),
          context.previousProperty
        );
      }
    },
    onSettled: (_, __, { propertyId }) => {
      // Always refetch
      queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEYS.detail(propertyId) });
    },
  });
};

/**
 * Mutation hook to upload property images
 */
export const useUploadPropertyImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, images }: { propertyId: string; images: File[] }) =>
      propertiesService.uploadPropertyImages(propertyId, images),
    onSuccess: (imageUrls, { propertyId }) => {
      // Invalidate property details to refetch with new images
      queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEYS.detail(propertyId) });
    },
  });
};

/**
 * Mutation hook to delete property image
 */
export const useDeletePropertyImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, imageUrl }: { propertyId: string; imageUrl: string }) =>
      propertiesService.deletePropertyImage(propertyId, imageUrl),
    onSuccess: (_, { propertyId }) => {
      // Invalidate property details to refetch with updated images
      queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEYS.detail(propertyId) });
    },
  });
};