import * as React from "react"
import Link from "next/link"
import {
  Plus,
  Building2,
  Calendar,
  DollarSign,
  Users,
  Star,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Bed,
  Bath,
  Wifi,
  Car,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3
} from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge
} from "@book-me-now/ui"

/**
 * Mock data for host dashboard - Replace with actual API calls
 */
const mockHostData = {
  stats: {
    totalProperties: 5,
    totalRevenue: 28500,
    monthlyBookings: 23,
    averageRating: 4.7,
    occupancyRate: 78
  },
  recentBookings: [
    {
      id: "1",
      guestName: "Sarah Johnson",
      propertyName: "Cozy Downtown Apartment",
      checkIn: "2024-12-15",
      checkOut: "2024-12-20",
      nights: 5,
      guests: 2,
      total: 850,
      status: "pending"
    },
    {
      id: "2",
      guestName: "Michael Chen",
      propertyName: "Mountain View Cabin",
      checkIn: "2024-12-10",
      checkOut: "2024-12-17",
      nights: 7,
      guests: 4,
      total: 1400,
      status: "confirmed"
    },
    {
      id: "3",
      guestName: "Emma Wilson",
      propertyName: "Beachfront Villa",
      checkIn: "2024-12-22",
      checkOut: "2024-12-28",
      nights: 6,
      guests: 6,
      total: 2100,
      status: "confirmed"
    }
  ],
  properties: [
    {
      id: "1",
      title: "Cozy Downtown Apartment",
      location: "New York, NY",
      type: "Apartment",
      bedrooms: 2,
      bathrooms: 1,
      guests: 4,
      pricePerNight: 120,
      rating: 4.8,
      reviews: 45,
      bookings: 12,
      revenue: 5400,
      status: "active",
      amenities: ["Wifi", "Kitchen", "Air Conditioning"],
      image: "/api/placeholder/400/300"
    },
    {
      id: "2",
      title: "Mountain View Cabin",
      location: "Aspen, CO",
      type: "Cabin",
      bedrooms: 3,
      bathrooms: 2,
      guests: 6,
      pricePerNight: 200,
      rating: 4.9,
      reviews: 28,
      bookings: 8,
      revenue: 8200,
      status: "active",
      amenities: ["Wifi", "Fireplace", "Hot Tub"],
      image: "/api/placeholder/400/300"
    },
    {
      id: "3",
      title: "Beachfront Villa",
      location: "Miami, FL",
      type: "Villa",
      bedrooms: 4,
      bathrooms: 3,
      guests: 8,
      pricePerNight: 350,
      rating: 4.6,
      reviews: 62,
      bookings: 15,
      revenue: 12600,
      status: "active",
      amenities: ["Pool", "Beach Access", "Wifi"],
      image: "/api/placeholder/400/300"
    }
  ]
}

/**
 * Host Stats Card Component
 */
interface HostStatsCardProps {
  title: string
  value: string | number
  description: string
  icon: React.ComponentType<{ className?: string }>
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: "blue" | "green" | "purple" | "orange"
}

function HostStatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  color = "blue"
}: HostStatsCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600"
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
              {trend && (
                <div className={`flex items-center text-sm ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {Math.abs(trend.value)}%
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Property Card Component
 */
interface PropertyCardProps {
  property: typeof mockHostData.properties[0]
}

function PropertyCard({ property }: PropertyCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200 group">
      <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
        <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
          <Building2 className="h-12 w-12 text-white opacity-80" />
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {property.title}
              </h4>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">{property.location}</span>
              </div>
            </div>
            <Badge className={getStatusColor(property.status)}>
              {property.status}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                {property.bedrooms}
              </div>
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                {property.bathrooms}
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {property.guests}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-900">
                {property.rating}
              </span>
              <span className="text-sm text-gray-500">
                ({property.reviews} reviews)
              </span>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                ${property.pricePerNight}
              </p>
              <p className="text-xs text-gray-500">per night</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100 text-sm">
            <div>
              <p className="text-gray-500">Monthly Revenue</p>
              <p className="font-semibold text-green-600">
                ${property.revenue.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Total Bookings</p>
              <p className="font-semibold text-blue-600">
                {property.bookings}
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-4 space-x-2">
        <Link href={`/properties/${property.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
        </Link>
        <Link href={`/properties/${property.id}/edit`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </Link>
        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

/**
 * Booking Request Component
 */
interface BookingRequestProps {
  booking: typeof mockHostData.recentBookings[0]
}

function BookingRequest({ booking }: BookingRequestProps) {
  const checkInDate = new Date(booking.checkIn)
  const checkOutDate = new Date(booking.checkOut)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "declined":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "declined":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-medium text-gray-900">{booking.guestName}</h4>
              <p className="text-sm text-gray-600">{booking.propertyName}</p>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(booking.status)}
              <Badge className={getStatusColor(booking.status)}>
                {booking.status}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Check-in</p>
              <p className="font-medium text-gray-900">
                {checkInDate.toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Check-out</p>
              <p className="font-medium text-gray-900">
                {checkOutDate.toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {booking.nights} nights
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {booking.guests} guests
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                ${booking.total.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">total</p>
            </div>
          </div>

          {booking.status === "pending" && (
            <div className="flex space-x-2 pt-2">
              <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button size="sm" variant="outline" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50">
                <XCircle className="mr-2 h-4 w-4" />
                Decline
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Host Dashboard Page Component
 */
export default function HostDashboardPage() {
  const { stats, recentBookings, properties } = mockHostData

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Host Dashboard 🏠
          </h1>
          <p className="mt-1 text-gray-600">
            Manage your properties, bookings, and earnings
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Link href="/properties/new">
            <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Button>
          </Link>
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <HostStatsCard
          title="Properties"
          value={stats.totalProperties}
          description="Active listings"
          icon={Building2}
          color="blue"
        />
        <HostStatsCard
          title="Monthly Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          description="This month's earnings"
          icon={DollarSign}
          trend={{ value: 15, isPositive: true }}
          color="green"
        />
        <HostStatsCard
          title="Bookings"
          value={stats.monthlyBookings}
          description="This month"
          icon={Calendar}
          trend={{ value: 8, isPositive: true }}
          color="purple"
        />
        <HostStatsCard
          title="Average Rating"
          value={stats.averageRating}
          description="Across all properties"
          icon={Star}
          color="orange"
        />
        <HostStatsCard
          title="Occupancy Rate"
          value={`${stats.occupancyRate}%`}
          description="This month"
          icon={TrendingUp}
          trend={{ value: 12, isPositive: true }}
          color="blue"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Properties Section */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Properties ({properties.length})
            </h2>
            <Link href="/properties">
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                Manage All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Bookings
            </h2>
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <BookingRequest key={booking.id} booking={booking} />
            ))}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Manage your hosting business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/properties/new">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Property
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Manage Calendar
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="mr-2 h-4 w-4" />
                Payout Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}