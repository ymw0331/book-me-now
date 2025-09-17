"use client"

import * as React from "react"
import { Search, MapPin, Calendar, Users, Bed, X, Clock } from "lucide-react"
import { cn } from "@book-me-now/utils"
import { Button } from "./button"
import { Badge } from "./badge"

/**
 * Search criteria interface
 */
export interface SearchCriteria {
  location: string
  coordinates?: { lat: number; lng: number }
  checkIn?: Date
  checkOut?: Date
  guests: number
  bedrooms: number
}

/**
 * Location suggestion interface
 */
export interface LocationSuggestion {
  id: string
  description: string
  type: 'city' | 'region' | 'country' | 'landmark'
  coordinates?: { lat: number; lng: number }
}

/**
 * Recent search interface
 */
export interface RecentSearch extends SearchCriteria {
  id: string
  timestamp: Date
}

/**
 * Search bar props interface
 */
export interface SearchBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Search layout style
   */
  variant?: 'compact' | 'expanded' | 'modal'

  /**
   * Current search criteria
   */
  value?: Partial<SearchCriteria>

  /**
   * Location suggestions (for autocomplete)
   */
  locationSuggestions?: LocationSuggestion[]

  /**
   * Recent searches
   */
  recentSearches?: RecentSearch[]

  /**
   * Loading state for suggestions
   */
  loading?: boolean

  /**
   * Show recent searches
   */
  showRecentSearches?: boolean

  /**
   * Event handlers
   */
  onSearch?: (criteria: SearchCriteria) => void
  onLocationChange?: (location: string) => void
  onLocationSelect?: (suggestion: LocationSuggestion) => void
  onClear?: () => void
  onRecentSearchSelect?: (search: RecentSearch) => void
}

/**
 * Modern search bar component with Airbnb-style design
 *
 * Features:
 * - Multi-step search flow (location, dates, guests)
 * - Location autocomplete with suggestions
 * - Date range picker integration
 * - Guest and bedroom counters
 * - Recent searches
 * - Responsive design with modal support
 *
 * Usage:
 * <SearchBar
 *   onSearch={handleSearch}
 *   onLocationChange={handleLocationChange}
 *   locationSuggestions={suggestions}
 *   showRecentSearches={true}
 * />
 */
const SearchBar = React.forwardRef<HTMLDivElement, SearchBarProps>(
  ({
    className,
    variant = 'compact',
    value,
    locationSuggestions = [],
    recentSearches = [],
    loading = false,
    showRecentSearches = false,
    onSearch,
    onLocationChange,
    onLocationSelect,
    onClear,
    onRecentSearchSelect,
    ...props
  }, ref) => {

    const [isExpanded, setIsExpanded] = React.useState(false)
    const [activeStep, setActiveStep] = React.useState<'location' | 'dates' | 'guests' | null>(null)
    const [searchData, setSearchData] = React.useState<Partial<SearchCriteria>>({
      location: value?.location || '',
      guests: value?.guests || 1,
      bedrooms: value?.bedrooms || 1,
      checkIn: value?.checkIn,
      checkOut: value?.checkOut,
      ...value
    })
    const [showSuggestions, setShowSuggestions] = React.useState(false)

    // Sync value prop with internal state
    React.useEffect(() => {
      if (value) {
        setSearchData(prev => ({
          ...prev,
          location: value.location || prev.location,
          guests: value.guests || prev.guests,
          bedrooms: value.bedrooms || prev.bedrooms,
          checkIn: value.checkIn || prev.checkIn,
          checkOut: value.checkOut || prev.checkOut
        }))
      }
    }, [value])

    // Format date for display
    const formatDate = (date: Date | undefined) => {
      if (!date) return 'Add dates'
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    // Handle location input change
    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newLocation = e.target.value
      setSearchData(prev => ({ ...prev, location: newLocation }))
      onLocationChange?.(newLocation)
      setShowSuggestions(newLocation.length > 0)
    }

    // Handle location suggestion selection
    const handleLocationSelect = (suggestion: LocationSuggestion) => {
      setSearchData(prev => ({
        ...prev,
        location: suggestion.description,
        coordinates: suggestion.coordinates
      }))
      setShowSuggestions(false)
      setActiveStep('dates')
      onLocationSelect?.(suggestion)
    }

    // Handle date selection
    const handleDateChange = (type: 'checkIn' | 'checkOut', date: Date) => {
      setSearchData(prev => ({ ...prev, [type]: date }))
    }

    // Handle guest/bedroom counter
    const handleCounterChange = (type: 'guests' | 'bedrooms', increment: boolean) => {
      setSearchData(prev => ({
        ...prev,
        [type]: Math.max(1, (prev[type] || 1) + (increment ? 1 : -1))
      }))
    }

    // Handle search submission
    const handleSearch = () => {
      if (searchData.location && onSearch) {
        onSearch({
          location: searchData.location,
          coordinates: searchData.coordinates,
          checkIn: searchData.checkIn,
          checkOut: searchData.checkOut,
          guests: searchData.guests || 1,
          bedrooms: searchData.bedrooms || 1
        })
        setIsExpanded(false)
        setActiveStep(null)
      }
    }

    // Handle recent search selection
    const handleRecentSearchSelect = (search: RecentSearch) => {
      setSearchData(search)
      onRecentSearchSelect?.(search)
    }

    // Handle clear
    const handleClear = () => {
      setSearchData({ location: '', guests: 1, bedrooms: 1 })
      setActiveStep(null)
      setShowSuggestions(false)
      onClear?.()
    }

    // Check if search is valid
    const isSearchValid = searchData.location && searchData.location.length > 0

    if (variant === 'compact' && !isExpanded) {
      return (
        <div
          ref={ref}
          className={cn(
            "relative max-w-2xl mx-auto",
            className
          )}
          {...props}
        >
          <button
            onClick={() => setIsExpanded(true)}
            className={cn(
              "w-full flex items-center justify-between",
              "bg-white rounded-full shadow-lg hover:shadow-xl",
              "border border-gray-200/50 transition-all duration-300",
              "px-6 py-4 text-left group"
            )}
          >
            <div className="flex items-center space-x-4 flex-1">
              <div className="flex items-center space-x-2 flex-1">
                <Search className="h-5 w-5 text-accent-airbnb" />
                <div>
                  <div className="font-semibold text-sm text-gray-900">
                    {searchData.location || "Where to?"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {searchData.checkIn && searchData.checkOut
                      ? `${formatDate(searchData.checkIn)} - ${formatDate(searchData.checkOut)}`
                      : "Anywhere • Any week"
                    } • Add guests
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-accent-airbnb p-3 rounded-full group-hover:scale-105 transition-transform">
              <Search className="h-4 w-4 text-white" />
            </div>
          </button>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full max-w-4xl mx-auto",
          variant === 'modal' && "bg-white rounded-2xl shadow-2xl p-6",
          className
        )}
        {...props}
      >
        {/* Main Search Form */}
        <div className={cn(
          "flex flex-col lg:flex-row items-stretch",
          "bg-white rounded-2xl shadow-xl border border-gray-200/50",
          "divide-y lg:divide-y-0 lg:divide-x divide-gray-200"
        )}>

          {/* Location Input */}
          <div className="flex-1 relative">
            <div className="p-6">
              <label className="block text-xs font-semibold text-gray-900 mb-2">
                WHERE
              </label>
              <input
                type="text"
                placeholder="Search destinations"
                value={searchData.location}
                onChange={handleLocationChange}
                onFocus={() => {
                  setActiveStep('location')
                  setShowSuggestions(searchData.location.length > 0)
                }}
                className="w-full text-sm text-gray-900 placeholder:text-gray-500 bg-transparent border-0 p-0 focus:outline-none focus:ring-0"
              />
            </div>

            {/* Location Suggestions Dropdown */}
            {showSuggestions && activeStep === 'location' && (
              <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200/50 max-h-80 overflow-auto">
                {loading && (
                  <div className="p-4 text-sm text-gray-500 text-center">
                    <div className="animate-spin h-4 w-4 border-2 border-accent-airbnb border-t-transparent rounded-full mx-auto mb-2"></div>
                    Searching locations...
                  </div>
                )}

                {!loading && locationSuggestions.length === 0 && searchData.location && (
                  <div className="p-4 text-sm text-gray-500 text-center">
                    No locations found
                  </div>
                )}

                {locationSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleLocationSelect(suggestion)}
                    className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <MapPin className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-gray-900">
                        {suggestion.description}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {suggestion.type}
                      </div>
                    </div>
                  </button>
                ))}

                {/* Recent Searches */}
                {showRecentSearches && recentSearches.length > 0 && (
                  <>
                    <div className="border-t border-gray-200 pt-3 px-4 pb-2">
                      <div className="flex items-center space-x-2 text-xs font-semibold text-gray-700">
                        <Clock className="h-3 w-3" />
                        <span>Recent searches</span>
                      </div>
                    </div>
                    {recentSearches.slice(0, 3).map((search) => (
                      <button
                        key={search.id}
                        onClick={() => handleRecentSearchSelect(search)}
                        className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Clock className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm text-gray-900">
                            {search.location}
                          </div>
                          <div className="text-xs text-gray-500">
                            {search.checkIn && search.checkOut
                              ? `${formatDate(search.checkIn)} - ${formatDate(search.checkOut)}`
                              : "Flexible dates"
                            }
                          </div>
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Check-in Date */}
          <div className="flex-1">
            <div className="p-6">
              <label className="block text-xs font-semibold text-gray-900 mb-2">
                CHECK-IN
              </label>
              <button
                onClick={() => setActiveStep('dates')}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors text-left"
              >
                {formatDate(searchData.checkIn)}
              </button>
            </div>
          </div>

          {/* Check-out Date */}
          <div className="flex-1">
            <div className="p-6">
              <label className="block text-xs font-semibold text-gray-900 mb-2">
                CHECK-OUT
              </label>
              <button
                onClick={() => setActiveStep('dates')}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors text-left"
              >
                {formatDate(searchData.checkOut)}
              </button>
            </div>
          </div>

          {/* Guests & Bedrooms */}
          <div className="flex-1">
            <div className="p-6">
              <label className="block text-xs font-semibold text-gray-900 mb-2">
                WHO
              </label>
              <button
                onClick={() => setActiveStep('guests')}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors text-left"
              >
                {searchData.guests === 1 ? '1 guest' : `${searchData.guests} guests`}
                {searchData.bedrooms && searchData.bedrooms > 1 &&
                  ` • ${searchData.bedrooms} bedrooms`
                }
              </button>
            </div>

            {/* Guests Dropdown */}
            {activeStep === 'guests' && (
              <div className="absolute top-full right-0 z-50 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200/50 p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">Guests</div>
                      <div className="text-xs text-gray-500">Ages 13 or above</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => handleCounterChange('guests', false)}
                        disabled={searchData.guests === 1}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">
                        {searchData.guests}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => handleCounterChange('guests', true)}
                        disabled={searchData.guests === 16}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">Bedrooms</div>
                      <div className="text-xs text-gray-500">Number of bedrooms</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => handleCounterChange('bedrooms', false)}
                        disabled={searchData.bedrooms === 1}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">
                        {searchData.bedrooms}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => handleCounterChange('bedrooms', true)}
                        disabled={searchData.bedrooms === 8}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Button */}
          <div className="flex-shrink-0">
            <div className="p-6 flex items-center space-x-3">
              {variant === 'expanded' && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClear}
                  className="rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button
                onClick={handleSearch}
                disabled={!isSearchValid}
                className="bg-gradient-accent hover:shadow-lg px-6 py-3 rounded-full font-semibold"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Filters (for expanded variant) */}
        {variant === 'expanded' && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-gray-50">
              I'm flexible
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-gray-50">
              Europe
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-gray-50">
              United States
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-gray-50">
              Japan
            </Badge>
          </div>
        )}

        {/* Backdrop for closing dropdowns */}
        {activeStep && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setActiveStep(null)
              setShowSuggestions(false)
            }}
          />
        )}
      </div>
    )
  }
)
SearchBar.displayName = "SearchBar"

export { SearchBar }