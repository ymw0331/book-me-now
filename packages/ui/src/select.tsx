import * as React from "react"
import { cn } from "@book-me-now/utils"
import { Check, ChevronDown, X, Search } from "lucide-react"

interface SelectOption {
  value: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
}

interface SelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string | string[]
  onChange?: (value: string | string[]) => void
  options: SelectOption[]
  placeholder?: string
  multiple?: boolean
  searchable?: boolean
  disabled?: boolean
  clearable?: boolean
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({
    className,
    value,
    onChange,
    options,
    placeholder = "Select an option",
    multiple = false,
    searchable = false,
    disabled = false,
    clearable = false,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [searchTerm, setSearchTerm] = React.useState("")
    const [selectedValues, setSelectedValues] = React.useState<string[]>(
      multiple
        ? Array.isArray(value) ? value : []
        : value ? [value] : []
    )

    const filteredOptions = React.useMemo(() => {
      if (!searchTerm) return options
      return options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }, [options, searchTerm])

    const getDisplayValue = () => {
      if (selectedValues.length === 0) return placeholder

      if (multiple) {
        const labels = selectedValues
          .map(val => options.find(opt => opt.value === val)?.label)
          .filter(Boolean)
        return labels.length > 2
          ? `${labels.slice(0, 2).join(', ')}... (+${labels.length - 2})`
          : labels.join(', ')
      }

      return options.find(opt => opt.value === selectedValues[0])?.label || placeholder
    }

    const handleSelect = (optionValue: string) => {
      let newValues: string[]

      if (multiple) {
        if (selectedValues.includes(optionValue)) {
          newValues = selectedValues.filter(v => v !== optionValue)
        } else {
          newValues = [...selectedValues, optionValue]
        }
      } else {
        newValues = [optionValue]
        setIsOpen(false)
      }

      setSelectedValues(newValues)
      onChange?.(multiple ? newValues : newValues[0])
      setSearchTerm("")
    }

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation()
      setSelectedValues([])
      onChange?.(multiple ? [] : "")
      setSearchTerm("")
    }

    const hasValue = selectedValues.length > 0

    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        {...props}
      >
        <button
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "w-full px-3 py-2 text-left bg-white border rounded-lg",
            "flex items-center justify-between",
            "transition-all duration-200",
            disabled
              ? "bg-gray-50 text-gray-400 cursor-not-allowed"
              : "hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            isOpen && "ring-2 ring-blue-500 border-transparent"
          )}
        >
          <span className={cn("truncate", !hasValue && "text-gray-500")}>
            {getDisplayValue()}
          </span>
          <div className="flex items-center space-x-1">
            {clearable && hasValue && !disabled && (
              <button
                onClick={handleClear}
                className="p-0.5 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="h-3.5 w-3.5 text-gray-500" />
              </button>
            )}
            <ChevronDown
              className={cn(
                "h-4 w-4 text-gray-400 transition-transform",
                isOpen && "transform rotate-180"
              )}
            />
          </div>
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-full mt-1 z-50 w-full bg-white rounded-lg shadow-lg border max-h-60 overflow-auto">
              {searchable && (
                <div className="p-2 border-b sticky top-0 bg-white">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search..."
                      className="w-full pl-8 pr-3 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              )}

              <div className="py-1">
                {filteredOptions.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-500 text-center">
                    No options found
                  </div>
                ) : (
                  filteredOptions.map((option) => {
                    const isSelected = selectedValues.includes(option.value)

                    return (
                      <button
                        key={option.value}
                        onClick={() => !option.disabled && handleSelect(option.value)}
                        disabled={option.disabled}
                        className={cn(
                          "w-full px-3 py-2 text-left flex items-center justify-between",
                          "transition-colors text-sm",
                          option.disabled
                            ? "text-gray-400 cursor-not-allowed"
                            : isSelected
                              ? "bg-blue-50 text-blue-600"
                              : "hover:bg-gray-50"
                        )}
                      >
                        <div className="flex items-center space-x-2">
                          {option.icon && <span className="h-4 w-4">{option.icon}</span>}
                          <span>{option.label}</span>
                        </div>
                        {isSelected && (
                          <Check className="h-4 w-4 text-blue-600" />
                        )}
                      </button>
                    )
                  })
                )}
              </div>

              {multiple && selectedValues.length > 0 && (
                <div className="border-t p-2">
                  <div className="flex flex-wrap gap-1">
                    {selectedValues.map(val => {
                      const option = options.find(opt => opt.value === val)
                      if (!option) return null

                      return (
                        <span
                          key={val}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs"
                        >
                          {option.label}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSelect(val)
                            }}
                            className="hover:bg-blue-200 rounded-full p-0.5"
                          >
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    )
  }
)

Select.displayName = "Select"

export { Select, type SelectOption }