"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu,
  X,
  Home,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Settings,
  Heart,
  Search,
  Globe,
  MapPin
} from "lucide-react"
import { cn } from "@book-me-now/utils"
import { Button } from "./button"
import { Container } from "./container"
import { Badge } from "./badge"

/**
 * Navigation item interface
 */
export interface NavItem {
  href: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string | number
  show?: boolean
}

/**
 * User profile interface
 */
export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  isHost?: boolean
}

/**
 * Navigation component props
 */
export interface NavigationProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Current user (null if not authenticated)
   */
  user?: UserProfile | null

  /**
   * Navigation items to display
   */
  navItems?: NavItem[]

  /**
   * Show search bar in navigation
   */
  showSearch?: boolean

  /**
   * Brand logo and name
   */
  brand?: {
    name: string
    logo?: React.ReactNode
    href?: string
  }

  /**
   * Event handlers
   */
  onLogin?: () => void
  onLogout?: () => void
  onRegister?: () => void
  onSearch?: (query: string) => void
  onProfileClick?: () => void
}

/**
 * Modern navigation component with glass-morphism effect
 *
 * Features:
 * - Sticky header with blur backdrop effect
 * - Responsive mobile menu with smooth animations
 * - Integrated search functionality
 * - User menu dropdown
 * - Host/Guest mode indicators
 * - Glass-morphism design with subtle shadows
 *
 * Usage:
 * <Navigation
 *   user={currentUser}
 *   onLogout={handleLogout}
 *   onSearch={handleSearch}
 *   showSearch={true}
 * />
 */
const Navigation = React.forwardRef<HTMLElement, NavigationProps>(
  ({
    className,
    user,
    navItems = [],
    showSearch = false,
    brand = { name: "BookMe", href: "/" },
    onLogin,
    onLogout,
    onRegister,
    onSearch,
    onProfileClick,
    ...props
  }, ref) => {

    const [isMenuOpen, setIsMenuOpen] = React.useState(false)
    const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")
    const pathname = usePathname()

    // Default navigation items
    const defaultNavItems: NavItem[] = [
      { href: "/search", label: "Explore", icon: Globe, show: true },
      { href: "/dashboard", label: "Dashboard", icon: User, show: !!user },
      { href: "/dashboard/trips", label: "My Trips", icon: MapPin, show: !!user },
      { href: "/favorites", label: "Wishlist", icon: Heart, show: !!user },
    ]

    const displayNavItems = navItems.length > 0 ? navItems : defaultNavItems

    // Close menus when route changes
    React.useEffect(() => {
      setIsMenuOpen(false)
      setIsProfileMenuOpen(false)
    }, [pathname])

    // Handle search submission
    const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (searchQuery.trim() && onSearch) {
        onSearch(searchQuery.trim())
      }
    }

    // Toggle mobile menu
    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen)
    }

    // Toggle profile menu
    const toggleProfileMenu = () => {
      setIsProfileMenuOpen(!isProfileMenuOpen)
    }

    // Handle logout
    const handleLogout = () => {
      setIsProfileMenuOpen(false)
      onLogout?.()
    }

    return (
      <nav
        ref={ref}
        className={cn(
          // Base styles
          "sticky top-0 z-50 w-full transition-all duration-300",
          // Glass morphism effect
          "bg-white/80 backdrop-blur-xl border-b border-gray-200/50",
          // Shadow with glass effect
          "shadow-sm hover:shadow-md",
          className
        )}
        {...props}
      >
        <Container>
          <div className="flex h-16 items-center justify-between">
            {/* Logo/Brand */}
            <Link
              href={brand.href || "/"}
              className="flex items-center space-x-3 group transition-all duration-200 hover:scale-105"
            >
              {brand.logo || <Home className="h-7 w-7 text-accent-airbnb" />}
              <span className="text-xl font-bold bg-gradient-to-r from-accent-airbnb to-accent-booking bg-clip-text text-transparent group-hover:from-accent-booking group-hover:to-accent-airbnb transition-all duration-300">
                {brand.name}
              </span>
            </Link>

            {/* Desktop Search Bar */}
            {showSearch && (
              <div className="hidden md:flex flex-1 max-w-md mx-8">
                <form onSubmit={handleSearchSubmit} className="w-full">
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-accent-airbnb transition-colors" />
                    <input
                      type="text"
                      placeholder="Where would you like to go?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={cn(
                        "w-full pl-10 pr-4 py-2 text-sm",
                        "bg-white/50 backdrop-blur-sm border border-gray-300/50",
                        "rounded-full shadow-sm",
                        "focus:outline-none focus:ring-2 focus:ring-accent-airbnb/20 focus:border-accent-airbnb",
                        "placeholder:text-gray-500 transition-all duration-200",
                        "hover:bg-white/70 hover:shadow-md"
                      )}
                    />
                  </div>
                </form>
              </div>
            )}

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {displayNavItems.map((item) => {
                if (item.show === false) return null

                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      "hover:bg-white/50 hover:backdrop-blur-sm hover:shadow-sm",
                      isActive
                        ? "bg-accent-airbnb/10 text-accent-airbnb shadow-sm"
                        : "text-gray-700 hover:text-accent-airbnb"
                    )}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Desktop Auth/User Menu */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    onClick={toggleProfileMenu}
                    className={cn(
                      "flex items-center space-x-2 p-2 rounded-full",
                      "hover:bg-white/50 hover:shadow-md transition-all duration-200",
                      isProfileMenuOpen && "bg-white/50 shadow-md"
                    )}
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-accent-airbnb to-accent-booking flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {user.name.split(' ')[0]}
                    </span>
                    {user.isHost && (
                      <Badge variant="default" className="bg-accent-gold text-gray-900 text-xs">
                        Host
                      </Badge>
                    )}
                  </Button>

                  {/* Profile Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div className={cn(
                      "absolute right-0 top-full mt-2 w-64 py-2",
                      "bg-white/90 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50",
                      "animate-slideUp"
                    )}>
                      <div className="px-4 py-3 border-b border-gray-200/50">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={onProfileClick}
                          className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-white/50 transition-colors"
                        >
                          <User className="h-4 w-4" />
                          <span>Profile</span>
                        </button>
                        <button
                          onClick={() => {/* Handle settings */}}
                          className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-white/50 transition-colors"
                        >
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </button>
                      </div>

                      <div className="border-t border-gray-200/50 py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    onClick={onLogin}
                    className="flex items-center space-x-2 hover:bg-white/50"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Button>
                  <Button
                    onClick={onRegister}
                    className="flex items-center space-x-2 bg-gradient-accent hover:shadow-lg"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Sign up</span>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-white/50"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className={cn(
              "md:hidden border-t border-gray-200/50",
              "bg-white/90 backdrop-blur-xl animate-slideUp"
            )}>
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* Mobile Search */}
                {showSearch && (
                  <div className="px-3 py-2">
                    <form onSubmit={handleSearchSubmit}>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Where would you like to go?"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 text-sm bg-white/50 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-airbnb/20 focus:border-accent-airbnb"
                        />
                      </div>
                    </form>
                  </div>
                )}

                {/* Mobile Navigation Items */}
                {displayNavItems.map((item) => {
                  if (item.show === false) return null

                  const isActive = pathname === item.href
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between rounded-lg mx-3 px-3 py-2 text-base font-medium transition-colors",
                        isActive
                          ? "bg-accent-airbnb/10 text-accent-airbnb"
                          : "text-gray-700 hover:bg-white/50"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        {Icon && <Icon className="h-5 w-5" />}
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <Badge variant="secondary">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  )
                })}

                {/* Mobile Auth */}
                <div className="border-t border-gray-200/50 pt-3 mt-3 px-3">
                  {user ? (
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3 px-3 py-2">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-accent-airbnb to-accent-booking flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 rounded-lg w-full px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        onClick={onLogin}
                        variant="ghost"
                        className="w-full justify-start space-x-3"
                      >
                        <LogIn className="h-5 w-5" />
                        <span>Login</span>
                      </Button>
                      <Button
                        onClick={onRegister}
                        className="w-full justify-start space-x-3 bg-gradient-accent"
                      >
                        <UserPlus className="h-5 w-5" />
                        <span>Sign up</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Container>
      </nav>
    )
  }
)
Navigation.displayName = "Navigation"

export { Navigation }