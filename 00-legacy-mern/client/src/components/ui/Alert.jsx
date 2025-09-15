import { AlertCircle, CheckCircle, XCircle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const Alert = ({
  type = 'info',
  title,
  children,
  className,
  onClose,
  closable = false
}) => {
  const typeStyles = {
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: Info,
      iconClass: 'text-blue-400'
    },
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: CheckCircle,
      iconClass: 'text-green-400'
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: AlertCircle,
      iconClass: 'text-yellow-400'
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: XCircle,
      iconClass: 'text-red-400'
    }
  };

  const style = typeStyles[type] || typeStyles.info;
  const Icon = style.icon;

  return (
    <div
      className={cn(
        "relative flex p-4 border rounded-lg",
        style.container,
        className
      )}
    >
      <div className="flex-shrink-0">
        <Icon className={cn("w-5 h-5", style.iconClass)} />
      </div>
      <div className="ml-3 flex-1">
        {title && (
          <h3 className="text-sm font-medium mb-1">
            {title}
          </h3>
        )}
        <div className="text-sm">
          {children}
        </div>
      </div>
      {closable && onClose && (
        <button
          onClick={onClose}
          className="ml-auto -mr-1 -mt-1 flex-shrink-0 p-1 rounded-md hover:bg-black hover:bg-opacity-10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;