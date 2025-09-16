import * as React from "react"
import { cn } from "@book-me-now/utils"

interface Tab {
  value: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
  badge?: string | number
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: Tab[]
  value?: string
  onChange?: (value: string) => void
  variant?: 'default' | 'pills' | 'underline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({
    className,
    tabs,
    value,
    onChange,
    variant = 'default',
    size = 'md',
    fullWidth = false,
    children,
    ...props
  }, ref) => {
    const [selectedTab, setSelectedTab] = React.useState(value || tabs[0]?.value)

    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedTab(value)
      }
    }, [value])

    const handleTabClick = (tabValue: string, disabled?: boolean) => {
      if (disabled) return
      setSelectedTab(tabValue)
      onChange?.(tabValue)
    }

    const sizeClasses = {
      sm: "text-xs px-3 py-1.5",
      md: "text-sm px-4 py-2",
      lg: "text-base px-6 py-3"
    }

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <div className={cn(
          "flex",
          variant === 'default' && "border-b",
          fullWidth && "w-full"
        )}>
          {tabs.map((tab) => {
            const isSelected = selectedTab === tab.value

            return (
              <button
                key={tab.value}
                onClick={() => handleTabClick(tab.value, tab.disabled)}
                disabled={tab.disabled}
                className={cn(
                  "relative transition-all duration-200",
                  sizeClasses[size],
                  fullWidth && "flex-1",
                  tab.disabled && "opacity-50 cursor-not-allowed",

                  variant === 'default' && [
                    "border-b-2 -mb-[1px]",
                    isSelected
                      ? "border-blue-600 text-blue-600 font-medium"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  ],

                  variant === 'pills' && [
                    "rounded-lg mx-1",
                    isSelected
                      ? "bg-blue-600 text-white font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  ],

                  variant === 'underline' && [
                    "pb-3",
                    isSelected
                      ? "text-blue-600 font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  ]
                )}
              >
                <span className="flex items-center gap-2">
                  {tab.icon && <span className="h-4 w-4">{tab.icon}</span>}
                  {tab.label}
                  {tab.badge !== undefined && (
                    <span className={cn(
                      "inline-flex items-center justify-center rounded-full",
                      "min-w-[20px] h-5 px-1.5 text-xs font-medium",
                      isSelected
                        ? variant === 'pills'
                          ? "bg-white/20 text-white"
                          : "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    )}>
                      {tab.badge}
                    </span>
                  )}
                </span>
              </button>
            )
          })}
        </div>
        {children}
      </div>
    )
  }
)

Tabs.displayName = "Tabs"

interface TabContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  currentValue?: string
}

const TabContent = React.forwardRef<HTMLDivElement, TabContentProps>(
  ({ className, value, currentValue, children, ...props }, ref) => {
    if (currentValue !== value) return null

    return (
      <div
        ref={ref}
        className={cn("py-4", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

TabContent.displayName = "TabContent"

interface TabPanelsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
}

const TabPanels = React.forwardRef<HTMLDivElement, TabPanelsProps>(
  ({ className, value, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === TabContent) {
            return React.cloneElement(child as React.ReactElement<TabContentProps>, {
              currentValue: value
            })
          }
          return child
        })}
      </div>
    )
  }
)

TabPanels.displayName = "TabPanels"

export { Tabs, TabContent, TabPanels, type Tab }