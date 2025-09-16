import * as React from "react"
import { cn } from "@book-me-now/utils"

/**
 * Card - Main container component
 * 
 * Purpose:
 * - Creates a clean, elevated container for content
 * - Provides consistent spacing and shadow
 * - Foundation for hotel listings, booking summaries, etc.
 * 
 * Usage:
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Hotel Name</CardTitle>
 *   </CardHeader>
 *   <CardContent>
 *     Hotel details here...
 *   </CardContent>
 * </Card>
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm hover:shadow-md transition-shadow duration-200",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

/**
 * CardHeader - Top section of card (typically title, subtitle)
 * 
 * Purpose:
 * - Consistent spacing for card headers
 * - Proper typography hierarchy
 * - Used for hotel names, prices, ratings
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 pb-4", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

/**
 * CardTitle - Main title in card header
 * 
 * Purpose:
 * - Consistent typography for card titles
 * - Proper heading hierarchy
 * - SEO-friendly heading tags
 */
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight text-lg", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

/**
 * CardDescription - Subtitle/description in card header
 * 
 * Purpose:
 * - Muted text for additional context
 * - Hotel locations, dates, brief descriptions
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

/**
 * CardContent - Main content area of card
 * 
 * Purpose:
 * - Consistent padding for card body
 * - Main content area for hotel details, descriptions, etc.
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("p-6 pt-0", className)} 
    {...props} 
  />
))
CardContent.displayName = "CardContent"

/**
 * CardFooter - Bottom section of card (typically actions)
 * 
 * Purpose:
 * - Consistent spacing for card actions
 * - Buttons, links, additional metadata
 * - Hotel booking buttons, view details, etc.
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent 
}
