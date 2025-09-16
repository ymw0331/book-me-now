import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@book-me-now/utils"
import { AlertCircle, CheckCircle2, Info, X, XCircle } from "lucide-react"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive bg-red-50",
        success:
          "border-green-500/50 text-green-900 dark:border-green-500 [&>svg]:text-green-600 bg-green-50",
        warning:
          "border-yellow-500/50 text-yellow-900 dark:border-yellow-500 [&>svg]:text-yellow-600 bg-yellow-50",
        info:
          "border-blue-500/50 text-blue-900 dark:border-blue-500 [&>svg]:text-blue-600 bg-blue-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  onClose?: () => void
  icon?: React.ReactNode
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, onClose, icon, children, ...props }, ref) => {
    const defaultIcons = {
      destructive: <XCircle className="h-4 w-4" />,
      success: <CheckCircle2 className="h-4 w-4" />,
      warning: <AlertCircle className="h-4 w-4" />,
      info: <Info className="h-4 w-4" />,
      default: null,
    }

    const displayIcon = icon !== undefined ? icon : defaultIcons[variant || "default"]

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {displayIcon}
        {children}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-2 top-2 rounded-md p-1 hover:bg-black/5 transition-colors"
            aria-label="Close alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }