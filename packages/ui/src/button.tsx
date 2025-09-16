import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@book-me-now/utils"

/**
 * Button variants configuration using class-variance-authority
 * 
 * Why we use cva:
 * - Type-safe variants (TypeScript will catch errors)
 * - Consistent styling patterns
 * - Easy to maintain and extend
 * - Automatic prop validation
 */
const buttonVariants = cva(
  // Base classes applied to all buttons
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
        outline: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 shadow-sm",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        ghost: "text-gray-900 hover:bg-gray-100",
        link: "text-blue-600 underline-offset-4 hover:underline p-0",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Button component props interface
 * 
 * Extends native button props + our custom variant props
 * This gives us full TypeScript support + flexibility
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Render as child component (useful for Next.js Link)
   * Example: <Button asChild><Link href="/hotels">View Hotels</Link></Button>
   */
  asChild?: boolean
}

/**
 * Modern Button component with variants, sizes, and full accessibility
 * 
 * Features:
 * - Type-safe variants (primary, secondary, destructive, etc.)
 * - Multiple sizes (sm, default, lg, icon)
 * - Full accessibility (focus states, keyboard navigation)
 * - Can be used as any element via asChild prop
 * - Server Component compatible
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // If asChild is true, we render the child element instead of button
    // This is useful for Next.js Links: <Button asChild><Link href="...">
    const Comp = asChild ? "span" : "button"
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
