import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@book-me-now/utils"

/**
 * Badge variants configuration
 * 
 * Why different badge variants:
 * - default: General information (location, amenities)
 * - secondary: Less prominent info (dates, categories)
 * - destructive: Negative status (unavailable, cancelled)
 * - success: Positive status (available, confirmed)
 * - outline: Subtle emphasis (tags, filters)
 */
const badgeVariants = cva(
  // Base classes for all badges
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-blue-600 text-white hover:bg-blue-700",
        secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
        destructive: "border-transparent bg-red-600 text-white hover:bg-red-700",
        success: "border-transparent bg-green-600 text-white hover:bg-green-700",
        warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
        outline: "border-gray-300 text-gray-900 hover:bg-gray-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Badge component props
 * 
 * Extends HTML div attributes + our variant props
 * This allows for full HTML div functionality while maintaining type safety
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Badge component for labels, status indicators, and tags
 * 
 * Features:
 * - Multiple color variants for different use cases
 * - Consistent rounded design
 * - Hover states for interactive badges
 * - Perfect for hotel locations, availability status, amenities
 * 
 * Examples:
 * <Badge variant="success">Available</Badge>
 * <Badge variant="secondary">Singapore</Badge>
 * <Badge variant="destructive">Fully Booked</Badge>
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div 
      className={cn(badgeVariants({ variant }), className)} 
      {...props} 
    />
  )
}

export { Badge, badgeVariants }
