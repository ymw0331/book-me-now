"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Calendar,
  Settings,
  User,
  Building,
  Heart,
  Bell,
  LogOut,
  Menu,
  X
} from "lucide-react"
import { cn } from "@book-me-now/utils"
import { Button, Container } from "@book-me-now/ui"

/**
 * Dashboard navigation item interface
 */
interface DashboardNavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  badge?: string | number
}

/**
 * Mock user data - Replace with actual user context/API
 */
const mockUser = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: null,
  isHost: true,
  totalBookings: 12,
  pendingRequests: 3
}

/**
 * Dashboard sidebar navigation items
 */
const dashboardNavItems: DashboardNavItem[] = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: Home,
    description: "Dashboard overview and stats"
  },
  {
    href: "/dashboard/trips",
    label: "My Trips",
    icon: Calendar,
    description: "Manage your bookings and trips",
    badge: mockUser.totalBookings
  },
  {
    href: "/dashboard/host",
    label: "Host Dashboard",
    icon: Building,
    description: "Manage properties and bookings",
    badge: mockUser.pendingRequests
  },
  {
    href: "/dashboard/favorites",
    label: "Favorites",
    icon: Heart,
    description: "Your saved properties"
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
    description: "Account and preferences"
  }
]

/**
 * Dashboard Layout Component
 *
 * Provides consistent layout with sidebar navigation for all dashboard pages
 * Features responsive design with mobile menu support
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const pathname = usePathname()

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 group"
          >
            <Home className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              BookMe
            </span>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="hover:bg-gray-100"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
              {/* Logo */}
              <div className="flex items-center flex-shrink-0 px-4">
                <Link
                  href="/"
                  className="flex items-center space-x-3 group"
                >
                  <Home className="h-8 w-8 text-blue-600" />
                  <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    BookMe
                  </span>
                </Link>
              </div>

              {/* User Profile */}
              <div className="flex-shrink-0 px-4 mt-6">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                  {mockUser.avatar ? (
                    <img
                      src={mockUser.avatar}
                      alt={mockUser.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {mockUser.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {mockUser.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {mockUser.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="mt-6 flex-1 px-2 space-y-1">
                {dashboardNavItems.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={cn(
                          "flex-shrink-0 h-5 w-5",
                          isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"
                        )} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                          isActive
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </nav>

              {/* Logout Button */}
              <div className="flex-shrink-0 px-2 pb-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors group"
                >
                  <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-500" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
              onClick={toggleMobileMenu}
            />
            <div className="relative flex flex-col max-w-xs w-full bg-white shadow-xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <Link
                  href="/"
                  className="flex items-center space-x-3"
                  onClick={toggleMobileMenu}
                >
                  <Home className="h-8 w-8 text-blue-600" />
                  <span className="text-xl font-bold text-gray-900">
                    BookMe
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMobileMenu}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Mobile User Profile */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  {mockUser.avatar ? (
                    <img
                      src={mockUser.avatar}
                      alt={mockUser.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {mockUser.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {mockUser.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {mockUser.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 px-4 py-4 space-y-1">
                {dashboardNavItems.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={toggleMobileMenu}
                      className={cn(
                        "group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={cn(
                          "flex-shrink-0 h-5 w-5",
                          isActive ? "text-blue-600" : "text-gray-400"
                        )} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                          isActive
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-600"
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </nav>

              {/* Mobile Logout */}
              <div className="p-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors group"
                  onClick={toggleMobileMenu}
                >
                  <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-500" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <main className="flex-1">
            <Container className="py-6">
              {children}
            </Container>
          </main>
        </div>
      </div>
    </div>
  )
}