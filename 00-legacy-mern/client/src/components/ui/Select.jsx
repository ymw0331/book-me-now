import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

const Select = ({
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  className,
  disabled = false,
  size = 'default'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);

  const sizeClasses = {
    small: 'px-3 py-1 text-sm',
    default: 'px-3 py-2',
    large: 'px-4 py-3 text-lg'
  };

  return (
    <div ref={selectRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full",
          "border border-gray-300 rounded-md",
          "bg-white text-left",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          "transition-colors",
          disabled && "bg-gray-100 cursor-not-allowed opacity-60",
          !disabled && "hover:border-gray-400 cursor-pointer",
          sizeClasses[size]
        )}
        disabled={disabled}
      >
        <span className={cn(
          "block truncate",
          !selectedOption && "text-gray-400"
        )}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn(
          "w-4 h-4 ml-2 transition-transform",
          isOpen && "transform rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className={cn(
          "absolute z-50 w-full mt-1",
          "bg-white border border-gray-200 rounded-md shadow-lg",
          "max-h-60 overflow-auto"
        )}>
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              No options available
            </div>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={cn(
                  "flex items-center justify-between w-full px-3 py-2 text-left",
                  "hover:bg-gray-50 transition-colors",
                  option.value === value && "bg-blue-50"
                )}
              >
                <span className={cn(
                  "block truncate",
                  option.value === value && "font-medium text-blue-600"
                )}>
                  {option.label}
                </span>
                {option.value === value && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Select;