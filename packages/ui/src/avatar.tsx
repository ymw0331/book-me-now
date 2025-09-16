import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@book-me-now/utils"
import { User } from "lucide-react"

const avatarVariants = cva(
  "relative inline-flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  showOnlineStatus?: boolean
  isOnline?: boolean
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, showOnlineStatus, isOnline, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(avatarVariants({ size }), className)}
      {...props}
    >
      {children}
      {showOnlineStatus && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-white",
            size === "sm" && "h-2 w-2",
            size === "md" && "h-2.5 w-2.5",
            size === "lg" && "h-3 w-3",
            size === "xl" && "h-4 w-4",
            isOnline ? "bg-green-500" : "bg-gray-400"
          )}
        />
      )}
    </div>
  )
)
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => (
  <img
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
))
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    initials?: string
  }
>(({ className, initials, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 font-medium",
      className
    )}
    {...props}
  >
    {initials ? (
      <span className="text-sm uppercase">{initials}</span>
    ) : (
      children || <User className="h-4 w-4" />
    )}
  </div>
))
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }