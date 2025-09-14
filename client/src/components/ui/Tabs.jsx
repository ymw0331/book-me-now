import { cn } from '../../lib/utils';

const Tabs = ({ children, className }) => {
  return (
    <div className={cn("w-full", className)}>
      {children}
    </div>
  );
};

const TabsList = ({ children, className }) => {
  return (
    <div className={cn(
      "inline-flex items-center justify-start",
      "border-b border-gray-200 w-full",
      className
    )}>
      {children}
    </div>
  );
};

const TabsTrigger = ({
  children,
  active = false,
  onClick,
  className,
  disabled = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center",
        "px-4 py-2 -mb-px",
        "text-sm font-medium transition-all",
        "border-b-2",
        active ? [
          "border-blue-500 text-blue-600",
        ] : [
          "border-transparent text-gray-500",
          "hover:text-gray-700 hover:border-gray-300",
        ],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ children, value, activeValue, className }) => {
  if (value !== activeValue) return null;

  return (
    <div className={cn("mt-4", className)}>
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };