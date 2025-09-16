'use client'

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  CheckCircle,
  Calendar,
  MapPin,
  Users,
  CreditCard,
  Download,
  Mail,
  Home,
  Search,
  MessageCircle,
  Phone,
  Clock,
  Star,
  ArrowRight
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
  Alert,
} from "@book-me-now/ui"

/**
 * Booking confirmation data structure
 */
interface BookingConfirmation {
  bookingId: string
  propertyId: string
  propertyName: string
  propertyImage: string
  hostName: string
  hostEmail: string
  hostPhone: string
  checkIn: string
  checkOut: string
  guests: number
  nights: number
  total: number
  paymentMethod: string
  paymentStatus: 'succeeded' | 'processing' | 'requires_action'
  confirmationNumber: string
  bookingDate: string
}

/**
 * Mock function to get booking confirmation details
 * In production, this would fetch from your API using the session_id
 */
async function getBookingConfirmation(sessionId?: string): Promise<BookingConfirmation | null> {
  if (!sessionId) return null

  // Mock API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Mock booking confirmation data
  return {
    bookingId: "BK-2024-001567",
    propertyId: "prop_123",
    propertyName: "Marina Bay Luxury Hotel",
    propertyImage: "/api/placeholder/400/200",
    hostName: "Sarah Johnson",
    hostEmail: "sarah@marinabayluxury.com",
    hostPhone: "+65 9123 4567",
    checkIn: "2024-02-15",
    checkOut: "2024-02-18",
    guests: 2,
    nights: 3,
    total: 897,
    paymentMethod: "•••• 4242",
    paymentStatus: 'succeeded',
    confirmationNumber: "MB-LSH-2024-001567",
    bookingDate: new Date().toISOString()
  }
}

/**
 * Loading State Component
 */
function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Confirming Your Booking</h3>
              <p className="text-gray-600 mt-1">
                Please wait while we process your payment...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Booking Summary Component
 */
interface BookingSummaryProps {
  booking: BookingConfirmation
}

function BookingSummary({ booking }: BookingSummaryProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <Card className="border-green-200 bg-green-50/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <CardTitle className="text-green-900">Booking Confirmed!</CardTitle>
          </div>
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Confirmed
          </Badge>
        </div>
        <CardDescription>
          Confirmation #{booking.confirmationNumber}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Property Info */}
        <div className="flex space-x-4">
          <div className="flex-shrink-0">
            <img
              src={booking.propertyImage}
              alt={booking.propertyName}
              className="w-20 h-20 rounded-lg object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{booking.propertyName}</h3>
            <div className="mt-1 space-y-1">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                Marina Bay, Singapore
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                4.8 (124 reviews)
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(booking.total)}
            </p>
            <p className="text-sm text-gray-500">
              {booking.nights} nights
            </p>
          </div>
        </div>

        <div className="border-t my-4" />

        {/* Booking Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Check-in & Check-out</h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">Check-in:</span>
                  <span className="ml-2">{formatDate(booking.checkIn)}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">Check-out:</span>
                  <span className="ml-2">{formatDate(booking.checkOut)}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Guests</h4>
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2 text-gray-400" />
                <span>{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Host Information</h4>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{booking.hostName}</p>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{booking.hostEmail}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{booking.hostPhone}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Payment</h4>
              <div className="flex items-center text-sm">
                <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                <span>Card ending in {booking.paymentMethod}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Next Steps Component
 */
interface NextStepsProps {
  booking: BookingConfirmation
}

function NextSteps({ booking }: NextStepsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>What happens next?</CardTitle>
        <CardDescription>
          Here's what to expect before your stay
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Mail className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Confirmation email sent</h4>
              <p className="text-sm text-gray-600 mt-1">
                Check your email for booking details and receipt
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <MessageCircle className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Host will contact you</h4>
              <p className="text-sm text-gray-600 mt-1">
                Your host may reach out with check-in instructions and local tips
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Clock className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Check-in details coming soon</h4>
              <p className="text-sm text-gray-600 mt-1">
                You'll receive check-in instructions 24 hours before arrival
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Main Success Page Component
 */
export default function SuccessPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Extract URL parameters
  const sessionId = searchParams.get('session_id')
  const paymentIntent = searchParams.get('payment_intent')

  // Component state
  const [booking, setBooking] = React.useState<BookingConfirmation | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Load booking confirmation on mount
  React.useEffect(() => {
    const loadBookingConfirmation = async () => {
      try {
        const confirmation = await getBookingConfirmation(sessionId)
        if (confirmation) {
          setBooking(confirmation)
        } else {
          setError('Unable to retrieve booking confirmation')
        }
      } catch (error) {
        console.error('Failed to load booking confirmation:', error)
        setError('Failed to load booking confirmation')
      } finally {
        setLoading(false)
      }
    }

    loadBookingConfirmation()
  }, [sessionId])

  if (loading) {
    return <LoadingState />
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Unable to Load Confirmation</h3>
                <p className="text-gray-600 mt-1">
                  {error || 'Please check your email for booking details'}
                </p>
              </div>
              <div className="space-y-2">
                <Link href="/dashboard">
                  <Button className="w-full">Go to Dashboard</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full">Back to Home</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your booking has been confirmed. Get ready for an amazing stay!
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <BookingSummary booking={booking} />
            <NextSteps booking={booking} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Download Receipt
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/properties/${booking.propertyId}`}>
                    <MapPin className="mr-2 h-4 w-4" />
                    View Property
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/dashboard/bookings">
                    <Calendar className="mr-2 h-4 w-4" />
                    My Bookings
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact Host
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/help">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Customer Support
                  </Link>
                </Button>
                <div className="pt-3 border-t text-sm text-gray-600">
                  <p className="font-medium">Questions about your stay?</p>
                  <p>We're here to help 24/7</p>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <Card>
              <CardHeader>
                <CardTitle>Continue Exploring</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/search">
                    <Search className="mr-2 h-4 w-4" />
                    Book Another Stay
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/dashboard">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    My Dashboard
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <div>
              <h4 className="font-medium">Booking Secured</h4>
              <p className="text-sm mt-1">
                Your payment has been processed and your booking is confirmed.
                A confirmation email has been sent to your registered email address.
              </p>
            </div>
          </Alert>
        </div>
      </div>
    </div>
  )
}