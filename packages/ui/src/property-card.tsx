import * as React from "react"
import { Heart, MapPin, Star, Users, Bed, Calendar } from "lucide-react"
import { cn } from "@book-me-now/utils"
import { Card, CardContent } from "./card"
import { Badge } from "./badge"
import { Button } from "./button"

/**
 * Property card props interface
 */
export interface PropertyCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Property data object
   */
  property: {
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
  }

  /**
   * Display variant
   */
  variant?: 'default' | 'compact' | 'featured'

  /**
   * Show owner controls (edit, delete)
   */
  owner?: boolean

  /**
   * Show view details button
   */
  showViewButton?: boolean

  /**
   * Event handlers
   */
  onView?: (propertyId: string) => void
  onFavorite?: (propertyId: string) => void
  onEdit?: (propertyId: string) => void
  onDelete?: (propertyId: string) => void
}

/**
 * Modern property card component inspired by Airbnb aesthetics
 *
 * Features:
 * - Large hero image with 16:9 aspect ratio
 * - Heart favorite icon overlay (top-right)
 * - Superhost/Verified badges
 * - Smart pricing display with per night text
 * - Star rating with review count
 * - Quick booking button on hover
 * - Smooth animations and hover effects
 *
 * Usage:
 * <PropertyCard
 *   property={propertyData}
 *   onView={(id) => navigate(`/properties/${id}`)}
 *   onFavorite={toggleFavorite}
 * />
 */
const PropertyCard = React.forwardRef<HTMLDivElement, PropertyCardProps>(
  ({
    className,
    property,
    variant = 'default',
    owner = false,
    showViewButton = true,
    onView,
    onFavorite,
    onEdit,
    onDelete,
    ...props
  }, ref) => {

    const [imageLoaded, setImageLoaded] = React.useState(false)
    const [isFavorited, setIsFavorited] = React.useState(property.isFavorited || false)

    // Format currency (assuming USD for now)
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
      }).format(price)
    }

    // Format date
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    }

    // Calculate days between dates
    const calculateDays = (from: string, to?: string) => {
      if (!to) return null
      const fromDate = new Date(from)
      const toDate = new Date(to)
      const diffTime = Math.abs(toDate.getTime() - fromDate.getTime())
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    // Truncate text
    const truncateText = (text: string, maxLength: number) => {
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
    }

    // Handle favorite toggle
    const handleFavoriteClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      setIsFavorited(!isFavorited)
      onFavorite?.(property._id)
    }

    // Handle card click for viewing
    const handleCardClick = () => {
      if (onView) {
        onView(property._id)
      }
    }

    const imageUrl = property.image?.contentType
      ? `${process.env.NEXT_PUBLIC_API_URL || '/api'}/property/image/${property._id}`
      : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=450&fit=crop'

    const days = calculateDays(property.from, property.to)

    return (
      <div
        ref={ref}
        className={cn(
          "group cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl",
          variant === 'compact' && "max-w-sm",
          variant === 'featured' && "max-w-md",
          className
        )}
        onClick={handleCardClick}
        {...props}
      >
        <Card className="border-0 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white">
          {/* Image Container */}
          <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
            {/* Property Image */}
            <img
              src={imageUrl}
              alt={property.title}
              className={cn(
                "w-full h-full object-cover transition-all duration-500 group-hover:scale-105",
                !imageLoaded && "opacity-0",
                imageLoaded && "opacity-100"
              )}
              onLoad={() => setImageLoaded(true)}
            />

            {/* Image Overlay for Loading */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
            )}

            {/* Favorite Heart Icon */}
            <button
              onClick={handleFavoriteClick}
              className={cn(
                "absolute top-3 right-3 p-2 rounded-full transition-all duration-300 hover:scale-110",
                "bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl",
                isFavorited && "bg-accent-airbnb hover:bg-accent-airbnb"
              )}
              aria-label="Add to favorites"
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-colors duration-300",
                  isFavorited ? "fill-white text-white" : "text-gray-600"
                )}
              />
            </button>

            {/* Superhost Badge */}
            {property.isSuperhostProperty && (
              <div className="absolute top-3 left-3">
                <Badge
                  variant="default"
                  className="bg-white text-gray-900 font-medium shadow-lg border-0 px-3 py-1"
                >
                  Superhost
                </Badge>
              </div>
            )}

            {/* Quick Book Button (appears on hover) */}
            {showViewButton && (
              <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <Button
                  className="w-full bg-white text-gray-900 hover:bg-gray-50 font-medium shadow-xl border-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    onView?.(property._id)
                  }}
                >
                  Quick View
                </Button>
              </div>
            )}
          </div>

          {/* Content */}
          <CardContent className="p-4 space-y-3">
            {/* Location & Rating Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                <span className="font-medium">{property.location}</span>
              </div>

              {/* Rating */}
              {property.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {property.rating.toFixed(1)}
                  </span>
                  {property.reviewCount && (
                    <span className="text-sm text-gray-500">
                      ({property.reviewCount})
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2 group-hover:text-accent-airbnb transition-colors">
              {property.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {truncateText(property.content, 100)}
            </p>

            {/* Property Details */}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Bed className="h-4 w-4" />
                <span>{property.bed} bed{property.bed !== 1 ? 's' : ''}</span>
              </div>

              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>From {formatDate(property.from)}</span>
              </div>

              {days && (
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{days} day{days !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            {/* Price Row */}
            <div className="flex items-baseline justify-between pt-2">
              <div className="flex items-baseline space-x-1">
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(property.price)}
                </span>
                <span className="text-sm text-gray-600 font-normal">
                  / night
                </span>
              </div>

              {/* Owner Actions */}
              {owner && (
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit?.(property._id)
                    }}
                    className="border-gray-300 hover:border-accent-airbnb hover:text-accent-airbnb"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete?.(property._id)
                    }}
                    className="border-red-300 text-red-600 hover:border-red-500 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
)
PropertyCard.displayName = "PropertyCard"

export { PropertyCard }