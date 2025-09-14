import React from 'react';
import { cn } from '../../lib/utils';

const badgeVariants = {
  default: "bg-gray-100 text-gray-900",
  secondary: "bg-gray-200 text-gray-900",
  destructive: "bg-red-100 text-red-900",
  success: "bg-green-100 text-green-900",
  warning: "bg-yellow-100 text-yellow-900",
  outline: "border border-gray-300 text-gray-700"
};

const Badge = React.forwardRef(({
  className,
  variant = "default",
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export { Badge, badgeVariants };