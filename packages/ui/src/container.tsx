import * as React from "react"
import { cn } from "@book-me-now/utils"

/**
 * Container component props
 * 
 * Extends HTML div attributes for maximum flexibility
 */
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Maximum width variant
   * - sm: Small screens (640px)
   * - md: Medium screens (768px)
   * - lg: Large screens (1024px)  
   * - xl: Extra large screens (1280px)
   * - full: No max width restriction
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

/**
 * Container component for consistent page layouts
 * 
 * Purpose:
 * - Consistent max-width across pages
 * - Responsive padding that adapts to screen size
 * - Centered content with proper margins
 * - Different size variants for different use cases
 * 
 * Why we need this:
 * - Prevents content from stretching too wide on large screens
 * - Consistent spacing across all pages
 * - Mobile-responsive padding
 * 
 * Usage:
 * <Container size="lg">
 *   <h1>Page Content</h1>
 *   <HotelGrid />
 * </Container>
 */
const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', ...props }, ref) => {
    const sizeClasses = {
      sm: 'max-w-screen-sm',   // 640px
      md: 'max-w-screen-md',   // 768px
      lg: 'max-w-screen-lg',   // 1024px
      xl: 'max-w-screen-xl',   // 1280px
      full: 'max-w-none'       // No limit
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          // Base container styles
          "mx-auto px-4 sm:px-6 lg:px-8",
          // Size variant
          sizeClasses[size],
          className
        )}
        {...props}
      />
    )
  }
)
Container.displayName = "Container"

export { Container }
