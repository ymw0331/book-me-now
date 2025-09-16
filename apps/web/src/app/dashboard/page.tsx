import * as React from "react"
import Link from "next/link"
import {
  Calendar,
  MapPin,
  Star,
  TrendingUp,
  Clock,
  Users,
  DollarSign,
  Plus,
  ArrowRight,
  Building2,
  Heart
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
 * Mock data - Replace with actual API calls
 */
const mockDashboardData = {
  user: {
    name: "John Doe",
    memberSince: "2023",
    totalTrips: 12,
    upcomingTrips: 2,
    favoriteDestinations: ["Paris", "Tokyo", "New York"],
    recentActivity: [
      {
        id: "1",
        type: "booking",
        title: "Booked Mountain View Cabin",
        description: "Check-in: Dec 20, 2024",
        timestamp: "2 hours ago",
        status: "confirmed"
      },
      {
        id: "2",
        type: "review",
        title: "Reviewed Ocean Breeze Hotel",
        description: "5-star rating given",
        timestamp: "1 day ago",
        status: "completed"
      },
      {
        id: "3",
        type: "favorite",
        title: "Added to Favorites",
        description: "Downtown Luxury Apartment",
        timestamp: "3 days ago",
        status: "saved"
      }
    ]
  },
  upcomingTrips: [
    {
      id: "1",
      propertyName: "Mountain View Cabin",
      location: "Aspen, Colorado",
      checkIn: "2024-12-20",
      checkOut: "2024-12-27",
      nights: 7,
      guests: 4,
      total: 2800,
      status: "confirmed",
      image: "/api/placeholder/300/200"
    },
    {
      id: "2",
      propertyName: "Seaside Villa",
      location: "Malibu, California",
      checkIn: "2025-01-15",
      checkOut: "2025-01-20",
      nights: 5,
      guests: 2,
      total: 3500,
      status: "pending",
      image: "/api/placeholder/300/200"
    }
  ],
  quickStats: {
    totalBookings: 12,
    totalSpent: 18500,
    favoriteProperties: 8,
    avgRating: 4.8
  }
}

/**
 * Dashboard Stats Card Component
 */
interface StatsCardProps {
  title: string
  value: string | number
  description: string
  icon: React.ComponentType<{ className?: string }>
  trend?: {
    value: number
    isPositive: boolean
  }
}

function StatsCard({ title, value, description, icon: Icon, trend }: StatsCardProps) {
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
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Icon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Activity Feed Item Component
 */
interface ActivityItemProps {
  activity: typeof mockDashboardData.user.recentActivity[0]
}

function ActivityItem({ activity }: ActivityItemProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "saved":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Calendar className="h-4 w-4 text-blue-600" />
      case "review":
        return <Star className="h-4 w-4 text-yellow-600" />
      case "favorite":
        return <Heart className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="flex items-start space-x-3 p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex-shrink-0 w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
        {getActivityIcon(activity.type)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
          <Badge variant="secondary" className={getStatusColor(activity.status)}>
            {activity.status}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
        <p className="text-xs text-gray-500 mt-2">{activity.timestamp}</p>
      </div>
    </div>
  )
}

/**
 * Trip Card Component
 */
interface TripCardProps {
  trip: typeof mockDashboardData.upcomingTrips[0]
}

function TripCard({ trip }: TripCardProps) {
  const checkInDate = new Date(trip.checkIn)
  const checkOutDate = new Date(trip.checkOut)

  return (
    <Card className="hover:shadow-lg transition-all duration-200 group">
      <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
          <Building2 className="h-12 w-12 text-white opacity-80" />
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {trip.propertyName}
              </h4>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                {trip.location}
              </div>
            </div>
            <Badge
              variant={trip.status === "confirmed" ? "default" : "secondary"}
              className={trip.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
            >
              {trip.status}
            </Badge>
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
                {trip.nights} nights
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {trip.guests} guests
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                ${trip.total.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">total</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-4 pb-4">
        <Link href={`/dashboard/trips/${trip.id}`} className="w-full">
          <Button variant="outline" className="w-full group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

/**
 * Main Dashboard Page Component
 */
export default function DashboardPage() {
  const { user, upcomingTrips, quickStats } = mockDashboardData

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="mt-1 text-gray-600">
            Here's what's happening with your bookings and travel plans
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/search">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
              <Plus className="mr-2 h-4 w-4" />
              Book New Stay
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Bookings"
          value={quickStats.totalBookings}
          description="All-time reservations"
          icon={Calendar}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Total Spent"
          value={`$${quickStats.totalSpent.toLocaleString()}`}
          description="Lifetime spending"
          icon={DollarSign}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Favorite Properties"
          value={quickStats.favoriteProperties}
          description="Properties saved"
          icon={Heart}
        />
        <StatsCard
          title="Average Rating"
          value={quickStats.avgRating}
          description="Your reviews"
          icon={Star}
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Trips */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Upcoming Trips ({user.upcomingTrips})
            </h2>
            <Link href="/dashboard/trips">
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {upcomingTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">No upcoming trips</h3>
                  <p className="text-gray-500">Start planning your next adventure!</p>
                </div>
                <Link href="/search">
                  <Button>
                    Browse Properties
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Latest Updates</CardTitle>
              <CardDescription>
                Your recent bookings and interactions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {user.recentActivity.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/trips" className="w-full">
                <Button variant="outline" className="w-full">
                  View All Activity
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/search">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Book New Property
                </Button>
              </Link>
              <Link href="/dashboard/favorites">
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="mr-2 h-4 w-4" />
                  View Favorites
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Update Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}