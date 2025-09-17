// Re-export all properties hooks from the new implementation
export {
  useProperties,
  useProperty,
  useSearchProperties,
  useInfiniteSearchProperties,
  useUserProperties,
  useFeaturedProperties,
  useNearbyProperties,
  usePropertyAvailability,
  usePropertyStats,
  useCreateProperty,
  useUpdateProperty,
  useDeleteProperty,
  useTogglePropertyStatus,
  useUploadPropertyImages,
  useDeletePropertyImage,
  PROPERTIES_QUERY_KEYS,
} from '@/hooks/useProperties';