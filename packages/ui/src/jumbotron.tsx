import * as React from "react"
import { cn } from "@book-me-now/utils"
import { Container } from "./container"

/**
 * Jumbotron component props
 */
export interface JumbotronProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Background variant
   * - gradient: Blue gradient background
   * - image: Background image with overlay
   * - solid: Solid color background
   */
  variant?: 'gradient' | 'image' | 'solid'
  /**
   * Background image URL (used with image variant)
   */
  backgroundImage?: string
  /**
   * Container size for content
   */
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

/**
 * Jumbotron component for hero sections and prominent content areas
 * 
 * Purpose:
 * - Eye-catching hero sections for homepage
 * - Prominent call-to-action areas
 * - Feature announcements
 * - Search sections with beautiful backgrounds
 * 
 * Why we need this:
 * - Creates visual impact on landing pages
 * - Consistent hero section styling
 * - Flexible background options (gradients, images, solid)
 * - Responsive design that works on all devices
 * 
 * Features:
 * - Multiple background variants
 * - Responsive padding and spacing
 * - Centered content with proper typography
 * - Optional background image with overlay
 * 
 * Usage:
 * <Jumbotron variant="gradient">
 *   <h1>Find Your Perfect Stay</h1>
 *   <p>Discover amazing hotels worldwide</p>
 *   <SearchForm />
 * </Jumbotron>
 */
const Jumbotron = React.forwardRef<HTMLDivElement, JumbotronProps>(
  ({ 
    className, 
    variant = 'gradient', 
    backgroundImage, 
    containerSize = 'lg',
    children,
    style,
    ...props 
  }, ref) => {
    const variantClasses = {
      gradient: 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800',
      image: 'bg-cover bg-center bg-no-repeat',
      solid: 'bg-blue-600'
    }

    const backgroundStyle = variant === 'image' && backgroundImage ? {
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundImage})`,
      ...style
    } : style

    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "relative py-16 sm:py-24 lg:py-32",
          // Text color for all variants
          "text-white",
          // Background variant
          variantClasses[variant],
          className
        )}
        style={backgroundStyle}
        {...props}
      >
        {/* Content container */}
        <Container size={containerSize}>
          <div className="text-center">
            {children}
          </div>
        </Container>
      </div>
    )
  }
)
Jumbotron.displayName = "Jumbotron"

export { Jumbotron }
