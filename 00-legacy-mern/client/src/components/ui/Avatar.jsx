import { cn } from '../../lib/utils';
import { User } from 'lucide-react';

const Avatar = ({
  src,
  alt,
  fallback,
  size = 'default',
  className,
  onClick
}) => {
  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    default: 'w-10 h-10 text-sm',
    large: 'w-12 h-12 text-base',
    xlarge: 'w-16 h-16 text-lg'
  };

  const renderFallback = () => {
    if (fallback) {
      return <span className="font-medium">{fallback}</span>;
    }
    return <User className="w-1/2 h-1/2" />;
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        "rounded-full bg-gray-100 overflow-hidden",
        "flex-shrink-0",
        onClick && "cursor-pointer hover:opacity-80 transition-opacity",
        sizeClasses[size],
        className
      )}
      onClick={onClick}
    >
      {src ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center",
          "bg-gradient-to-br from-blue-400 to-blue-600 text-white",
          src && "hidden"
        )}
      >
        {renderFallback()}
      </div>
    </div>
  );
};

export default Avatar;