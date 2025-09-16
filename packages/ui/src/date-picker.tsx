import * as React from "react"
import { cn } from "@book-me-now/utils"
import { Button } from "./button"
import { Input } from "./input"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"

interface DatePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: Date | null
  onChange?: (date: Date | null) => void
  placeholder?: string
  minDate?: Date
  maxDate?: Date
  blockedDates?: Date[]
  format?: (date: Date) => string
  mode?: 'single' | 'range'
  startDate?: Date | null
  endDate?: Date | null
  onRangeChange?: (start: Date | null, end: Date | null) => void
}

const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  ({
    className,
    value,
    onChange,
    placeholder = "Select date",
    minDate,
    maxDate,
    blockedDates = [],
    format,
    mode = 'single',
    startDate,
    endDate,
    onRangeChange,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [currentMonth, setCurrentMonth] = React.useState(new Date())
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(value || null)
    const [rangeStart, setRangeStart] = React.useState<Date | null>(startDate || null)
    const [rangeEnd, setRangeEnd] = React.useState<Date | null>(endDate || null)
    const [hoveredDate, setHoveredDate] = React.useState<Date | null>(null)

    const formatDate = (date: Date | null) => {
      if (!date) return ''
      if (format) return format(date)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear()
      const month = date.getMonth()
      const firstDay = new Date(year, month, 1).getDay()
      const daysInMonth = new Date(year, month + 1, 0).getDate()

      const days: (Date | null)[] = []

      // Add empty slots for days before month starts
      for (let i = 0; i < firstDay; i++) {
        days.push(null)
      }

      // Add all days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day))
      }

      return days
    }

    const isDateDisabled = (date: Date) => {
      if (minDate && date < minDate) return true
      if (maxDate && date > maxDate) return true
      return blockedDates.some(blocked =>
        blocked.toDateString() === date.toDateString()
      )
    }

    const isDateInRange = (date: Date) => {
      if (mode !== 'range') return false
      if (!rangeStart) return false
      if (rangeEnd) {
        return date >= rangeStart && date <= rangeEnd
      }
      if (hoveredDate && rangeStart) {
        const end = hoveredDate > rangeStart ? hoveredDate : rangeStart
        const start = hoveredDate < rangeStart ? hoveredDate : rangeStart
        return date >= start && date <= end
      }
      return false
    }

    const handleDateClick = (date: Date) => {
      if (isDateDisabled(date)) return

      if (mode === 'single') {
        setSelectedDate(date)
        onChange?.(date)
        setIsOpen(false)
      } else {
        if (!rangeStart || (rangeStart && rangeEnd)) {
          setRangeStart(date)
          setRangeEnd(null)
        } else {
          if (date < rangeStart) {
            setRangeEnd(rangeStart)
            setRangeStart(date)
          } else {
            setRangeEnd(date)
          }
          onRangeChange?.(rangeStart, date < rangeStart ? rangeStart : date)
          setIsOpen(false)
        }
      }
    }

    const previousMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
    }

    const nextMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
    }

    const displayValue = mode === 'single'
      ? formatDate(selectedDate)
      : rangeStart && rangeEnd
        ? `${formatDate(rangeStart)} - ${formatDate(rangeEnd)}`
        : rangeStart
          ? `${formatDate(rangeStart)} - Select end date`
          : ''

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        <div className="relative">
          <Input
            value={displayValue}
            placeholder={placeholder}
            readOnly
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer pr-10"
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-full mt-2 z-50 w-80 p-4 bg-white rounded-lg shadow-xl border">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={previousMonth}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <h3 className="font-medium">
                  {currentMonth.toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </h3>
                <button
                  onClick={nextMonth}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentMonth).map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} />
                  }

                  const isDisabled = isDateDisabled(date)
                  const isSelected = mode === 'single'
                    ? selectedDate?.toDateString() === date.toDateString()
                    : rangeStart?.toDateString() === date.toDateString() ||
                      rangeEnd?.toDateString() === date.toDateString()
                  const isInRange = isDateInRange(date)
                  const isToday = date.toDateString() === new Date().toDateString()

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => handleDateClick(date)}
                      onMouseEnter={() => mode === 'range' && setHoveredDate(date)}
                      onMouseLeave={() => setHoveredDate(null)}
                      disabled={isDisabled}
                      className={cn(
                        "p-2 text-sm rounded-lg transition-colors",
                        isDisabled && "text-gray-300 cursor-not-allowed",
                        !isDisabled && !isSelected && !isInRange && "hover:bg-gray-100",
                        isSelected && "bg-blue-600 text-white hover:bg-blue-700",
                        isInRange && !isSelected && "bg-blue-100",
                        isToday && !isSelected && "font-bold"
                      )}
                    >
                      {date.getDate()}
                    </button>
                  )
                })}
              </div>

              {mode === 'range' && (
                <div className="mt-4 pt-4 border-t flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setRangeStart(null)
                      setRangeEnd(null)
                      onRangeChange?.(null, null)
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    disabled={!rangeStart || !rangeEnd}
                  >
                    Apply
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    )
  }
)

DatePicker.displayName = "DatePicker"

export { DatePicker }