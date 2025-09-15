import React from 'react';
import { cn } from '../../lib/utils';

const Section = React.forwardRef(({
  className,
  spacing = "default",
  ...props
}, ref) => {
  const spacingClasses = {
    none: "",
    sm: "py-8",
    default: "py-12 sm:py-16",
    lg: "py-16 sm:py-20",
    xl: "py-20 sm:py-24"
  };

  return (
    <section
      ref={ref}
      className={cn(
        spacingClasses[spacing],
        className
      )}
      {...props}
    />
  );
});

Section.displayName = "Section";

export { Section };