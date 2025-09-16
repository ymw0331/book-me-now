import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@book-me-now/utils"

const spinnerVariants = cva(
  "animate-spin",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
      },
      variant: {
        default: "text-gray-600",
        primary: "text-blue-600",
        secondary: "text-gray-500",
        success: "text-green-600",
        warning: "text-yellow-600",
        danger: "text-red-600",
        white: "text-white",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
)

interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string
  fullScreen?: boolean
  overlay?: boolean
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, variant, label, fullScreen, overlay, ...props }, ref) => {
    const spinner = (
      <svg
        className={cn(spinnerVariants({ size, variant }), className)}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    )

    if (fullScreen) {
      return (
        <div
          ref={ref}
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center",
            overlay && "bg-black/50 backdrop-blur-sm"
          )}
          {...props}
        >
          <div className="flex flex-col items-center gap-3">
            {spinner}
            {label && (
              <p className={cn(
                "text-sm font-medium",
                overlay ? "text-white" : "text-gray-600"
              )}>
                {label}
              </p>
            )}
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center gap-2", className)}
        {...props}
      >
        {spinner}
        {label && <span className="text-sm">{label}</span>}
      </div>
    )
  }
)

Spinner.displayName = "Spinner"

const SpinnerContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    loading?: boolean
    children?: React.ReactNode
    spinnerProps?: SpinnerProps
  }
>(({ className, loading = false, children, spinnerProps, ...props }, ref) => {
  if (!loading) return <>{children}</>

  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      {...props}
    >
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg z-10">
        <Spinner {...spinnerProps} />
      </div>
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
    </div>
  )
})

SpinnerContainer.displayName = "SpinnerContainer"

export { Spinner, SpinnerContainer, spinnerVariants }