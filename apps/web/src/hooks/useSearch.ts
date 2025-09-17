import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { propertiesService, PropertySearchParams } from '@/services/properties.service';
import { useSearchProperties, useInfiniteSearchProperties, PROPERTIES_QUERY_KEYS } from './useProperties';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Search suggestions hook
const useSearchSuggestions = (query: string, delay: number = 300) => {
  const debouncedQuery = useDebounce(query, delay);

  return useQuery({
    queryKey: ['search', 'suggestions', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) return [];

      // Mock search suggestions - replace with actual API call
      const suggestions = [
        `${debouncedQuery} hotels`,
        `${debouncedQuery} apartments`,
        `${debouncedQuery} vacation rentals`,
        `Best places in ${debouncedQuery}`,
        `${debouncedQuery} downtown`,
      ];

      return suggestions.slice(0, 5);
    },
    enabled: !!debouncedQuery && debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Location search hook
const useLocationSearch = (query: string, delay: number = 300) => {
  const debouncedQuery = useDebounce(query, delay);

  return useQuery({
    queryKey: ['search', 'locations', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) return [];

      // Mock location search - replace with actual geocoding API
      const locations = [
        { id: '1', name: `${debouncedQuery}, CA, USA`, type: 'city' },
        { id: '2', name: `${debouncedQuery}, NY, USA`, type: 'city' },
        { id: '3', name: `${debouncedQuery} Downtown`, type: 'neighborhood' },
        { id: '4', name: `${debouncedQuery} Beach`, type: 'area' },
        { id: '5', name: `${debouncedQuery} Airport`, type: 'landmark' },
      ];

      return locations.slice(0, 8);
    },
    enabled: !!debouncedQuery && debouncedQuery.length >= 2,
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
};

// Main search hook with debouncing
export const usePropertySearch = (
  initialFilters: PropertySearchParams = {},
  options: {
    debounceDelay?: number;
    enableAutoSearch?: boolean;
    enableInfiniteScroll?: boolean;
  } = {}
) => {
  const {
    debounceDelay = 500,
    enableAutoSearch = true,
    enableInfiniteScroll = false,
  } = options;

  // Search filters state
  const [filters, setFilters] = useState<PropertySearchParams>(initialFilters);
  const [searchTerm, setSearchTerm] = useState(initialFilters.location || '');

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);

  // Debounced filters
  const debouncedFilters = useDebounce(filters, debounceDelay);

  // Final search params with debounced values
  const searchParams = useMemo(() => ({
    ...debouncedFilters,
    location: debouncedSearchTerm || debouncedFilters.location,
  }), [debouncedFilters, debouncedSearchTerm]);

  // Use appropriate search hook based on configuration
  const searchQuery = useSearchProperties(searchParams);
  const infiniteSearchQuery = useInfiniteSearchProperties(searchParams);

  const activeQuery = enableInfiniteScroll ? infiniteSearchQuery : searchQuery;

  // Search suggestions
  const suggestionsQuery = useSearchSuggestions(searchTerm);
  const locationsQuery = useLocationSearch(searchTerm);

  // Update search term when location filter changes externally
  useEffect(() => {
    if (filters.location !== searchTerm) {
      setSearchTerm(filters.location || '');
    }
  }, [filters.location, searchTerm]);

  // Search actions
  const updateFilter = useCallback((key: keyof PropertySearchParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const updateFilters = useCallback((newFilters: Partial<PropertySearchParams>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
    setSearchTerm('');
  }, []);

  const search = useCallback((searchFilters: PropertySearchParams) => {
    setFilters(searchFilters);
    if (searchFilters.location) {
      setSearchTerm(searchFilters.location);
    }
  }, []);

  // Quick filter actions
  const setPriceRange = useCallback((min?: number, max?: number) => {
    updateFilters({ priceMin: min, priceMax: max });
  }, [updateFilters]);

  const setBedrooms = useCallback((beds: number) => {
    updateFilter('bed', beds);
  }, [updateFilter]);

  const setDates = useCallback((from?: string, to?: string) => {
    updateFilters({ from, to });
  }, [updateFilters]);

  const setLocation = useCallback((location: string) => {
    setSearchTerm(location);
    updateFilter('location', location);
  }, [updateFilter]);

  // Search state
  const hasActiveFilters = useMemo(() => {
    return Object.values(searchParams).some(value =>
      value !== undefined && value !== '' && value !== null
    );
  }, [searchParams]);

  const isSearching = useMemo(() => {
    return debouncedSearchTerm !== searchTerm ||
           JSON.stringify(debouncedFilters) !== JSON.stringify(filters);
  }, [debouncedSearchTerm, searchTerm, debouncedFilters, filters]);

  // Results
  const results = useMemo(() => {
    if (enableInfiniteScroll) {
      const pages = infiniteSearchQuery.data?.pages || [];
      return pages.flatMap(page => page.data || []);
    }
    return searchQuery.data?.data || [];
  }, [enableInfiniteScroll, infiniteSearchQuery.data, searchQuery.data]);

  const pagination = useMemo(() => {
    if (enableInfiniteScroll) {
      return infiniteSearchQuery.data?.pages[0]?.pagination;
    }
    return searchQuery.data?.pagination;
  }, [enableInfiniteScroll, infiniteSearchQuery.data, searchQuery.data]);

  return {
    // Search state
    filters,
    searchTerm,
    searchParams,
    isSearching,
    hasActiveFilters,

    // Results
    results,
    pagination,
    isLoading: activeQuery.isLoading,
    isFetching: activeQuery.isFetching,
    error: activeQuery.error,

    // Infinite scroll specific
    ...(enableInfiniteScroll && {
      hasNextPage: infiniteSearchQuery.hasNextPage,
      isFetchingNextPage: infiniteSearchQuery.isFetchingNextPage,
      fetchNextPage: infiniteSearchQuery.fetchNextPage,
    }),

    // Search suggestions
    suggestions: suggestionsQuery.data || [],
    locations: locationsQuery.data || [],
    isSuggestionsLoading: suggestionsQuery.isFetching,
    isLocationsLoading: locationsQuery.isFetching,

    // Actions
    setSearchTerm,
    updateFilter,
    updateFilters,
    resetFilters,
    search,
    setPriceRange,
    setBedrooms,
    setDates,
    setLocation,

    // Manual refetch
    refetch: activeQuery.refetch,
  };
};

// Quick search hook for simple location-based searches
export const useQuickSearch = (debounceDelay: number = 300) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, debounceDelay);

  const searchQuery = useSearchProperties(
    { location: debouncedQuery },
  );

  const suggestionsQuery = useSearchSuggestions(query, debounceDelay);

  return {
    query,
    setQuery,
    results: searchQuery.data?.data || [],
    isLoading: searchQuery.isLoading,
    isFetching: searchQuery.isFetching,
    error: searchQuery.error,
    suggestions: suggestionsQuery.data || [],
    isSuggestionsLoading: suggestionsQuery.isFetching,
  };
};

// Recent searches hook
export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState<PropertySearchParams[]>([]);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('recent-searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    }
  }, []);

  const addRecentSearch = useCallback((searchParams: PropertySearchParams) => {
    setRecentSearches(prev => {
      // Remove existing duplicate
      const filtered = prev.filter(search =>
        JSON.stringify(search) !== JSON.stringify(searchParams)
      );

      // Add to beginning and limit to 10
      const updated = [searchParams, ...filtered].slice(0, 10);

      // Save to localStorage
      try {
        localStorage.setItem('recent-searches', JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save recent searches:', error);
      }

      return updated;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('recent-searches');
    } catch (error) {
      console.error('Failed to clear recent searches:', error);
    }
  }, []);

  const removeRecentSearch = useCallback((index: number) => {
    setRecentSearches(prev => {
      const updated = prev.filter((_, i) => i !== index);
      try {
        localStorage.setItem('recent-searches', JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to update recent searches:', error);
      }
      return updated;
    });
  }, []);

  return {
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    removeRecentSearch,
  };
};

// Popular searches hook
export const usePopularSearches = () => {
  return useQuery({
    queryKey: ['search', 'popular'],
    queryFn: async () => {
      // Mock popular searches - replace with actual API call
      return [
        { location: 'New York', count: 1250 },
        { location: 'Los Angeles', count: 980 },
        { location: 'Miami', count: 750 },
        { location: 'San Francisco', count: 650 },
        { location: 'Chicago', count: 580 },
        { location: 'Las Vegas', count: 520 },
        { location: 'Seattle', count: 480 },
        { location: 'Boston', count: 420 },
      ];
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

// Export individual hooks for convenience
export {
  useDebounce,
  useSearchSuggestions,
  useLocationSearch,
};