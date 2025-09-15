import { cn } from '../../lib/utils';

const Spinner = ({
  size = 'default',
  className,
  color = 'primary'
}) => {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    default: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4'
  };

  const colorClasses = {
    primary: 'border-blue-500',
    secondary: 'border-gray-500',
    white: 'border-white'
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          "animate-spin rounded-full",
          "border-t-transparent border-r-transparent",
          sizeClasses[size],
          colorClasses[color],
          className
        )}
      />
    </div>
  );
};

export default Spinner;