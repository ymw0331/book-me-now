"use client"

import * as React from "react"
import Link from "next/link"
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Phone,
  MessageSquare,
  Star,
  Building2,
  Filter,
  Search,
  ChevronDown
} from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
  Input,
  Tabs
} from "@book-me-now/ui"
import { cn } from "@book-me-now/utils"

/**
 * Trip status type
 */
type TripStatus = "upcoming" | "ongoing" | "completed" | "cancelled"

/**
 * Mock trips data - Replace with actual API calls
 */
const mockTripsData = {
  upcoming: [
    {
      id: "1",
      propertyName: "Mountain View Cabin",
      location: "Aspen, Colorado",
      hostName: "Sarah Johnson",
      hostPhone: "+1 (555) 123-4567",
      checkIn: "2024-12-20",
      checkOut: "2024-12-27",
      nights: 7,
      guests: 4,
      total: 2800,
      status: "confirmed" as const,
      bookingDate: "2024-11-15",
      propertyType: "Cabin",
      image: "/api/placeholder/400/300"
    },
    {
      id: "2",
      propertyName: "Seaside Villa",
      location: "Malibu, California",
      hostName: "Michael Chen",
      hostPhone: "+1 (555) 987-6543",
      checkIn: "2025-01-15",
      checkOut: "2025-01-20",
      nights: 5,
      guests: 2,
      total: 3500,
      status: "pending" as const,
      bookingDate: "2024-12-01",
      propertyType: "Villa",
      image: "/api/placeholder/400/300"
    }
  ],
  past: [
    {
      id: "3",
      propertyName: "Downtown Loft",
      location: "New York, NY",
      hostName: "Emma Wilson",
      hostPhone: "+1 (555) 456-7890",
      checkIn: "2024-10-15",
      checkOut: "2024-10-20",
      nights: 5,
      guests: 2,
      total: 1250,
      status: "completed" as const,
      bookingDate: "2024-09-20",
      propertyType: "Apartment",
      rating: 5,
      reviewGiven: true,
      image: "/api/placeholder/400/300"
    },
    {
      id: "4",
      propertyName: "Beach House",
      location: "Miami, Florida",
      hostName: "David Rodriguez",
      hostPhone: "+1 (555) 234-5678",
      checkIn: "2024-08-10",
      checkOut: "2024-08-17",
      nights: 7,
      guests: 6,
      total: 2450,
      status: "completed" as const,
      bookingDate: "2024-07-15",
      propertyType: "House",
      rating: 4,
      reviewGiven: true,
      image: "/api/placeholder/400/300"
    },
    {
      id: "5",
      propertyName: "City Center Studio",
      location: "Chicago, IL",
      hostName: "Lisa Thompson",
      hostPhone: "+1 (555) 345-6789",
      checkIn: "2024-09-05",
      checkOut: "2024-09-08",
      nights: 3,
      guests: 1,
      total: 450,
      status: "cancelled" as const,
      bookingDate: "2024-08-20",
      propertyType: "Studio",
      image: "/api/placeholder/400/300"
    }
  ]
}

/**
 * Trip Card Component
 */
interface TripCardProps {
  trip: typeof mockTripsData.upcoming[0] | typeof mockTripsData.past[0]
  isUpcoming?: boolean
}

function TripCard({ trip, isUpcoming = false }: TripCardProps) {
  const checkInDate = new Date(trip.checkIn)
  const checkOutDate = new Date(trip.checkOut)
  const bookingDate = new Date(trip.bookingDate)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
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
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
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
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {trip.propertyName}
              </h4>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                {trip.location}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-1 flex-shrink-0" />
                Host: {trip.hostName}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(trip.status)}
              <Badge className={getStatusColor(trip.status)}>
                {trip.status}
              </Badge>
            </div>
          </div>

          {/* Dates */}
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

          {/* Trip Details */}
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

          {/* Past trip rating */}
          {!isUpcoming && "rating" in trip && trip.rating && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < trip.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">Your rating</span>
              </div>
              {"reviewGiven" in trip && trip.reviewGiven && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Review given
                </Badge>
              )}
            </div>
          )}

          {/* Booking Date */}
          <div className="text-xs text-gray-500">
            Booked on {bookingDate.toLocaleDateString()}
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-4">
        <div className="flex w-full space-x-2">
          {isUpcoming ? (
            <>
              {trip.status === "confirmed" && (
                <>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="mr-2 h-4 w-4" />
                    Contact Host
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                </>
              )}
              {trip.status === "pending" && (
                <Button variant="outline" size="sm" className="w-full text-yellow-600">
                  <Clock className="mr-2 h-4 w-4" />
                  Awaiting Confirmation
                </Button>
              )}
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Invoice
              </Button>
              {trip.status === "completed" && !("reviewGiven" in trip && trip.reviewGiven) && (
                <Button size="sm" className="flex-1">
                  <Star className="mr-2 h-4 w-4" />
                  Leave Review
                </Button>
              )}
              {trip.status === "completed" && "reviewGiven" in trip && trip.reviewGiven && (
                <Button variant="outline" size="sm" className="flex-1">
                  <Star className="mr-2 h-4 w-4" />
                  Edit Review
                </Button>
              )}
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

/**
 * Filter and Search Component
 */
function TripsFilter() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search */}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search trips by property or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filter Dropdown */}
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full sm:w-auto"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filter by Status
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>

        {isFilterOpen && (
          <div className="absolute top-full mt-2 right-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
            <div className="p-2 space-y-1">
              {[
                { value: "all", label: "All Trips" },
                { value: "confirmed", label: "Confirmed" },
                { value: "pending", label: "Pending" },
                { value: "completed", label: "Completed" },
                { value: "cancelled", label: "Cancelled" }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setStatusFilter(option.value)
                    setIsFilterOpen(false)
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                    statusFilter === option.value
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Trips Page Component
 */
export default function TripsPage() {
  const [activeTab, setActiveTab] = React.useState("upcoming")

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            My Trips ✈️
          </h1>
          <p className="mt-1 text-gray-600">
            Manage your bookings and travel history
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/search">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
              Book New Stay
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search */}
      <TripsFilter />

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "upcoming", label: "Upcoming", count: mockTripsData.upcoming.length },
            { id: "past", label: "Past Trips", count: mockTripsData.past.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Trip Content */}
      <div className="space-y-6">
        {activeTab === "upcoming" && (
          <div>
            {mockTripsData.upcoming.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {mockTripsData.upcoming.map((trip) => (
                  <TripCard key={trip.id} trip={trip} isUpcoming={true} />
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
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>
        )}

        {activeTab === "past" && (
          <div>
            {mockTripsData.past.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {mockTripsData.past.map((trip) => (
                  <TripCard key={trip.id} trip={trip} isUpcoming={false} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <Clock className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">No past trips</h3>
                    <p className="text-gray-500">Your travel history will appear here</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-200">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {mockTripsData.upcoming.length + mockTripsData.past.length}
              </h3>
              <p className="text-sm text-gray-600">Total Trips</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">8</h3>
              <p className="text-sm text-gray-600">Cities Visited</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">4.8</h3>
              <p className="text-sm text-gray-600">Average Rating Given</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}