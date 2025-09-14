import React from 'react';
import { cn } from '../../lib/utils';

const Container = React.forwardRef(({
  className,
  maxWidth = "7xl",
  padding = true,
  ...props
}, ref) => {
  const maxWidthClasses = {
    "sm": "max-w-sm",
    "md": "max-w-md",
    "lg": "max-w-lg",
    "xl": "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    "full": "max-w-full"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto",
        maxWidthClasses[maxWidth],
        padding && "px-4 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    />
  );
});

Container.displayName = "Container";

export { Container };