import * as React from "react"
import { cn } from "@book-me-now/utils"
import { MapPin, Star, Heart, Bed, Users } from "lucide-react"
import { Badge } from "./badge"

interface SmallCardProps extends React.HTMLAttributes<HTMLDivElement> {
  property: {
    id: string
    title: string
    location: string
    price: number
    image?: string
    rating?: number
    reviewCount?: number
    beds?: number
    guests?: number
    isFavorited?: boolean
    isSuperhostProperty?: boolean
  }
  onSelect?: (id: string) => void
  onFavorite?: (id: string) => void
  orientation?: 'horizontal' | 'vertical'
}

const SmallCard = React.forwardRef<HTMLDivElement, SmallCardProps>(
  ({
    className,
    property,
    onSelect,
    onFavorite,
    orientation = 'horizontal',
    ...props
  }, ref) => {
    const [isFavorited, setIsFavorited] = React.useState(property.isFavorited)

    const handleFavoriteClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      setIsFavorited(!isFavorited)
      onFavorite?.(property.id)
    }

    if (orientation === 'vertical') {
      return (
        <div
          ref={ref}
          className={cn(
            "group cursor-pointer bg-white rounded-lg overflow-hidden",
            "shadow-sm hover:shadow-lg transition-all duration-300",
            className
          )}
          onClick={() => onSelect?.(property.id)}
          {...props}
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
            {property.image ? (
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
            )}
            {onFavorite && (
              <button
                onClick={handleFavoriteClick}
                className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
              >
                <Heart
                  className={cn(
                    "h-3.5 w-3.5",
                    isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
                  )}
                />
              </button>
            )}
            {property.isSuperhostProperty && (
              <Badge
                variant="secondary"
                className="absolute top-2 left-2 bg-white/90 text-xs px-1.5 py-0.5"
              >
                Superhost
              </Badge>
            )}
          </div>

          <div className="p-3">
            <h4 className="font-medium text-sm truncate mb-1">{property.title}</h4>
            <p className="text-xs text-gray-600 flex items-center mb-2">
              <MapPin className="h-3 w-3 mr-1" />
              {property.location}
            </p>

            {(property.beds || property.guests) && (
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                {property.beds && (
                  <span className="flex items-center">
                    <Bed className="h-3 w-3 mr-1" />
                    {property.beds}
                  </span>
                )}
                {property.guests && (
                  <span className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {property.guests}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-sm">${property.price}</span>
                <span className="text-xs text-gray-600"> /night</span>
              </div>
              {property.rating && (
                <div className="flex items-center text-xs">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-0.5" />
                  <span className="font-medium">{property.rating}</span>
                  {property.reviewCount && (
                    <span className="text-gray-500 ml-0.5">({property.reviewCount})</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }

    // Horizontal orientation (default)
    return (
      <div
        ref={ref}
        className={cn(
          "group cursor-pointer bg-white rounded-lg overflow-hidden",
          "shadow-sm hover:shadow-lg transition-all duration-300",
          "flex items-center gap-3 p-3",
          className
        )}
        onClick={() => onSelect?.(property.id)}
        {...props}
      >
        <div className="relative w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          {property.image ? (
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
          )}
          {property.isSuperhostProperty && (
            <Badge
              variant="secondary"
              className="absolute top-1 left-1 text-xs px-1 py-0.5 bg-white/90"
            >
              <Star className="h-2.5 w-2.5" />
            </Badge>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h4 className="font-medium text-sm truncate flex-1">{property.title}</h4>
            {onFavorite && (
              <button
                onClick={handleFavoriteClick}
                className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <Heart
                  className={cn(
                    "h-3.5 w-3.5",
                    isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"
                  )}
                />
              </button>
            )}
          </div>

          <p className="text-xs text-gray-600 flex items-center mb-1">
            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate">{property.location}</span>
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {property.beds && (
                <span className="flex items-center text-xs text-gray-500">
                  <Bed className="h-3 w-3 mr-0.5" />
                  {property.beds}
                </span>
              )}
              {property.guests && (
                <span className="flex items-center text-xs text-gray-500">
                  <Users className="h-3 w-3 mr-0.5" />
                  {property.guests}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {property.rating && (
                <div className="flex items-center text-xs">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-0.5" />
                  <span className="font-medium">{property.rating}</span>
                </div>
              )}
              <div className="text-right">
                <span className="font-semibold text-sm">${property.price}</span>
                <span className="text-xs text-gray-600">/n</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

SmallCard.displayName = "SmallCard"

export { SmallCard }