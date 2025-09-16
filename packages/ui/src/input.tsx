import * as React from "react"
import { cn } from "@book-me-now/utils"

/**
 * Input component interface
 * 
 * Extends native HTML input attributes
 * This provides full input functionality while maintaining our design system
 */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Error state styling
   * When true, shows red border and error styles
   */
  error?: boolean
  /**
   * Helper text or error message
   * Displays below the input field
   */
  helperText?: string
}

/**
 * Modern Input component with consistent styling and states
 * 
 * Features:
 * - Consistent border radius and spacing
 * - Focus states with ring for accessibility
 * - Error state styling
 * - Helper text support
 * - Placeholder styling
 * - Disabled state handling
 * 
 * Perfect for:
 * - Hotel search inputs (location, dates)
 * - Booking forms (name, email, phone)
 * - User authentication (login, register)
 * 
 * Examples:
 * <Input placeholder="Where do you want to go?" />
 * <Input type="email" error helperText="Please enter a valid email" />
 * <Input type="date" />
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            // Base styles
            "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
            // Placeholder styles
            "placeholder:text-gray-500",
            // Focus styles - ring for accessibility
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            // Disabled styles
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
            // Error styles
            error && "border-red-500 focus:ring-red-500",
            // Transition for smooth interactions
            "transition-colors duration-200",
            className
          )}
          ref={ref}
          {...props}
        />
        {/* Helper text or error message */}
        {helperText && (
          <p 
            className={cn(
              "mt-1 text-xs",
              error ? "text-red-600" : "text-gray-600"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
