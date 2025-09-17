'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Container,
  PropertyCard,
  SearchBar,
  Button,
  Badge,
  Card,
  CardContent
} from '@book-me-now/ui'
import {
  Filter,
  Map,
  Grid3X3,
  SlidersHorizontal,
  X,
  MapPin,
  Star,
  Wifi,
  Car,
  Coffee,
  Waves,
  Mountain,
  Building
} from 'lucide-react'

// Search filters interface
interface SearchFilters {
  minPrice: number
  maxPrice: number
  propertyTypes: string[]
  amenities: string[]
  rating: number
  bedrooms: number[]
  sortBy: 'price' | 'rating' | 'distance' | 'newest'
  sortOrder: 'asc' | 'desc'
}

// Property interface (based on existing PropertyCard props)
interface Property {
  _id: string
  title: string
  price: number
  location: string
  content: string
  bed: number
  from: string
  to?: string
  image?: {
    contentType: string
  }
  rating?: number
  reviewCount?: number
  isSuperhostProperty?: boolean
  isFavorited?: boolean
  amenities?: string[]
  propertyType?: string
  distance?: number
}

export default function SearchPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Search state
  const [searchResults, setSearchResults] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [totalResults, setTotalResults] = useState(0)

  // Current search criteria from URL
  const [searchCriteria, setSearchCriteria] = useState({
    location: searchParams.get('location') || '',
    checkIn: searchParams.get('checkIn') ? new Date(searchParams.get('checkIn')!) : undefined,
    checkOut: searchParams.get('checkOut') ? new Date(searchParams.get('checkOut')!) : undefined,
    guests: parseInt(searchParams.get('guests') || '1'),
    bedrooms: parseInt(searchParams.get('bedrooms') || '1')
  })

  // Search filters
  const [filters, setFilters] = useState<SearchFilters>({
    minPrice: 0,
    maxPrice: 1000,
    propertyTypes: [],
    amenities: [],
    rating: 0,
    bedrooms: [],
    sortBy: 'rating',
    sortOrder: 'desc'
  })

  // Property types and amenities for filters
  const propertyTypes = [
    { id: 'hotel', label: 'Hotels', icon: <Building className="h-4 w-4" /> },
    { id: 'resort', label: 'Resorts', icon: <Waves className="h-4 w-4" /> },
    { id: 'villa', label: 'Villas', icon: <Mountain className="h-4 w-4" /> },
    { id: 'apartment', label: 'Apartments', icon: <Building className="h-4 w-4" /> }
  ]

  const amenitiesList = [
    { id: 'wifi', label: 'Free WiFi', icon: <Wifi className="h-4 w-4" /> },
    { id: 'parking', label: 'Free Parking', icon: <Car className="h-4 w-4" /> },
    { id: 'breakfast', label: 'Breakfast', icon: <Coffee className="h-4 w-4" /> },
    { id: 'pool', label: 'Swimming Pool', icon: <Waves className="h-4 w-4" /> }
  ]

  // Load search results
  useEffect(() => {
    const loadSearchResults = async () => {
      setLoading(true)
      try {
        // Simulate API call - replace with actual search API
        await new Promise(resolve => setTimeout(resolve, 1000))

        const mockResults = generateMockResults(searchCriteria.location)
        setSearchResults(mockResults)
        setTotalResults(mockResults.length)
      } catch (error) {
        console.error('Error loading search results:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSearchResults()
  }, [searchCriteria, filters])

  // Handle new search
  const handleNewSearch = (criteria: any) => {
    const params = new URLSearchParams()
    if (criteria.location) params.set('location', criteria.location)
    if (criteria.checkIn) params.set('checkIn', criteria.checkIn.toISOString().split('T')[0])
    if (criteria.checkOut) params.set('checkOut', criteria.checkOut.toISOString().split('T')[0])
    if (criteria.guests) params.set('guests', criteria.guests.toString())
    if (criteria.bedrooms) params.set('bedrooms', criteria.bedrooms.toString())

    router.push(`/search?${params.toString()}`)
    setSearchCriteria(criteria)
  }

  // Handle filter changes
  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  // Handle property type filter
  const handlePropertyTypeToggle = (typeId: string) => {
    setFilters(prev => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(typeId)
        ? prev.propertyTypes.filter(id => id !== typeId)
        : [...prev.propertyTypes, typeId]
    }))
  }

  // Handle amenities filter
  const handleAmenityToggle = (amenityId: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }))
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 1000,
      propertyTypes: [],
      amenities: [],
      rating: 0,
      bedrooms: [],
      sortBy: 'rating',
      sortOrder: 'desc'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <Container className="py-4">
          <SearchBar
            variant="compact"
            value={searchCriteria}
            onSearch={handleNewSearch}
            onLocationChange={(location) => setSearchCriteria(prev => ({ ...prev, location }))}
            showRecentSearches={true}
          />
        </Container>
      </div>

      <Container className="py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden lg:block'} w-80 flex-shrink-0`}>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-sm"
                    >
                      Clear all
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowFilters(false)}
                      className="lg:hidden"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Price Range */}
                  <div>
                    <h4 className="font-medium mb-3">Price range</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          placeholder="Min price"
                          value={filters.minPrice}
                          onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value) || 0)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="number"
                          placeholder="Max price"
                          value={filters.maxPrice}
                          onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value) || 1000)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Property Types */}
                  <div>
                    <h4 className="font-medium mb-3">Property type</h4>
                    <div className="space-y-2">
                      {propertyTypes.map((type) => (
                        <label key={type.id} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.propertyTypes.includes(type.id)}
                            onChange={() => handlePropertyTypeToggle(type.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex items-center space-x-2">
                            {type.icon}
                            <span className="text-sm">{type.label}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h4 className="font-medium mb-3">Amenities</h4>
                    <div className="space-y-2">
                      {amenitiesList.map((amenity) => (
                        <label key={amenity.id} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.amenities.includes(amenity.id)}
                            onChange={() => handleAmenityToggle(amenity.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex items-center space-x-2">
                            {amenity.icon}
                            <span className="text-sm">{amenity.label}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <h4 className="font-medium mb-3">Guest rating</h4>
                    <div className="space-y-2">
                      {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                        <label key={rating} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="rating"
                            checked={filters.rating === rating}
                            onChange={() => handleFilterChange('rating', rating)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{rating}+ stars</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <h4 className="font-medium mb-3">Bedrooms</h4>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5].map((bed) => (
                        <Button
                          key={bed}
                          variant={filters.bedrooms.includes(bed) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setFilters(prev => ({
                              ...prev,
                              bedrooms: prev.bedrooms.includes(bed)
                                ? prev.bedrooms.filter(b => b !== bed)
                                : [...prev.bedrooms, bed]
                            }))
                          }}
                          className="w-12 h-10"
                        >
                          {bed}{bed === 5 ? '+' : ''}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {searchCriteria.location ? `Stays in ${searchCriteria.location}` : 'Search Results'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {loading ? 'Searching...' : `${totalResults} properties found`}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                {/* Sort Dropdown */}
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-') as [string, 'asc' | 'desc']
                    setFilters(prev => ({ ...prev, sortBy: sortBy as any, sortOrder }))
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="rating-desc">Highest rated</option>
                  <option value="price-asc">Price: Low to high</option>
                  <option value="price-desc">Price: High to low</option>
                  <option value="distance-asc">Distance</option>
                  <option value="newest-desc">Newest</option>
                </select>

                {/* View Toggle */}
                <div className="flex items-center border border-gray-300 rounded-md">
                  <Button
                    variant={!showMap ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setShowMap(false)}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={showMap ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setShowMap(true)}
                    className="rounded-l-none"
                  >
                    <Map className="h-4 w-4" />
                  </Button>
                </div>

                {/* Mobile Filter Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.propertyTypes.length > 0 || filters.amenities.length > 0 || filters.rating > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.propertyTypes.map((typeId) => {
                  const type = propertyTypes.find(t => t.id === typeId)
                  return (
                    <Badge
                      key={typeId}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handlePropertyTypeToggle(typeId)}
                    >
                      {type?.label}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  )
                })}
                {filters.amenities.map((amenityId) => {
                  const amenity = amenitiesList.find(a => a.id === amenityId)
                  return (
                    <Badge
                      key={amenityId}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleAmenityToggle(amenityId)}
                    >
                      {amenity?.label}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  )
                })}
                {filters.rating > 0 && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleFilterChange('rating', 0)}
                  >
                    {filters.rating}+ stars
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-[16/9] rounded-lg mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Results Grid */}
            {!loading && (
              <>
                {searchResults.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your search or filters to find more properties.
                    </p>
                    <Button onClick={clearFilters}>Clear filters</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.map((property) => (
                      <PropertyCard
                        key={property._id}
                        property={property}
                        onView={(id) => router.push(`/properties/${id}`)}
                        onFavorite={(id) => {
                          // Handle favorite toggle
                          console.log('Toggle favorite:', id)
                        }}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Load More Button */}
            {!loading && searchResults.length > 0 && searchResults.length % 9 === 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load more properties
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}

// Mock data generator for demonstration
function generateMockResults(location: string): Property[] {
  const locations = ['Singapore', 'Bali', 'Tokyo', 'New York', 'London', 'Paris']
  const searchLocation = location || locations[Math.floor(Math.random() * locations.length)]

  return Array.from({ length: 12 }, (_, i) => ({
    _id: `property-${i + 1}`,
    title: `Beautiful ${['Hotel', 'Resort', 'Villa', 'Apartment'][i % 4]} in ${searchLocation}`,
    price: Math.floor(Math.random() * 500) + 100,
    location: searchLocation,
    content: `Amazing property with stunning views and premium amenities. Perfect for your stay in ${searchLocation}.`,
    bed: Math.floor(Math.random() * 4) + 1,
    from: new Date().toISOString().split('T')[0],
    rating: Math.floor(Math.random() * 20) / 10 + 3.5,
    reviewCount: Math.floor(Math.random() * 1000) + 50,
    isSuperhostProperty: Math.random() > 0.7,
    isFavorited: Math.random() > 0.8,
    image: { contentType: 'image/jpeg' },
    amenities: ['wifi', 'parking', 'pool'].filter(() => Math.random() > 0.5),
    propertyType: ['hotel', 'resort', 'villa', 'apartment'][i % 4],
    distance: Math.floor(Math.random() * 50) + 1
  }))
}