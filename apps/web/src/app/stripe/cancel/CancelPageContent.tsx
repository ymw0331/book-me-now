'use client'

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  XCircle,
  RotateCcw,
  ArrowLeft,
  Home,
  Search,
  MessageCircle,
  HelpCircle,
  CreditCard,
  AlertTriangle,
  Clock
} from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Alert,
  Badge
} from "@book-me-now/ui"

/**
 * Cancellation reason types from URL parameters
 */
type CancellationReason =
  | 'user_cancelled'
  | 'payment_failed'
  | 'session_expired'
  | 'insufficient_funds'
  | 'card_declined'
  | 'unknown'

/**
 * Booking attempt data structure from URL parameters
 */
interface BookingAttempt {
  propertyId?: string
  propertyName?: string
  checkIn?: string
  checkOut?: string
  guests?: number
  total?: number
}

/**
 * Mock function to get booking details from property ID
 * In production, this would fetch from your API
 */
async function getBookingDetails(propertyId?: string): Promise<BookingAttempt | null> {
  if (!propertyId) return null

  // Mock API delay
  await new Promise(resolve => setTimeout(resolve, 100))

  // Mock property data
  return {
    propertyId,
    propertyName: "Marina Bay Luxury Hotel",
    checkIn: "2024-02-15",
    checkOut: "2024-02-18",
    guests: 2,
    total: 897
  }
}

/**
 * Main Stripe Cancel Page Component
 * Handles payment cancellations with contextual messaging and retry options
 */
export default function CancelPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Extract URL parameters
  const sessionId = searchParams.get('session_id')
  const reason = (searchParams.get('reason') || 'unknown') as CancellationReason
  const propertyId = searchParams.get('property_id')

  // Component state
  const [bookingDetails, setBookingDetails] = React.useState<BookingAttempt | null>(null)
  const [loading, setLoading] = React.useState(true)

  // Load booking details on mount
  React.useEffect(() => {
    const loadBookingDetails = async () => {
      try {
        const details = await getBookingDetails(propertyId)
        setBookingDetails(details)
      } catch (error) {
        console.error('Failed to load booking details:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBookingDetails()
  }, [propertyId])

  /**
   * Get reason-specific messaging and styling
   */
  const getReasonInfo = (reason: CancellationReason) => {
    switch (reason) {
      case 'user_cancelled':
        return {
          title: 'Booking Cancelled',
          message: 'You cancelled the payment process.',
          icon: <XCircle className="h-16 w-16 text-gray-400" />,
          variant: 'default' as const,
          showRetry: true,
          actionText: 'Try booking again'
        }
      case 'payment_failed':
        return {
          title: 'Payment Failed',
          message: 'We were unable to process your payment.',
          icon: <CreditCard className="h-16 w-16 text-red-500" />,
          variant: 'error' as const,
          showRetry: true,
          actionText: 'Try different payment method'
        }
      case 'session_expired':
        return {
          title: 'Session Expired',
          message: 'Your payment session has expired for security reasons.',
          icon: <Clock className="h-16 w-16 text-orange-500" />,
          variant: 'warning' as const,
          showRetry: true,
          actionText: 'Start new booking'
        }
      case 'insufficient_funds':
        return {
          title: 'Insufficient Funds',
          message: 'Your payment method has insufficient funds.',
          icon: <AlertTriangle className="h-16 w-16 text-red-500" />,
          variant: 'error' as const,
          showRetry: true,
          actionText: 'Try different payment method'
        }
      case 'card_declined':
        return {
          title: 'Card Declined',
          message: 'Your card was declined by your bank.',
          icon: <XCircle className="h-16 w-16 text-red-500" />,
          variant: 'error' as const,
          showRetry: true,
          actionText: 'Try different card'
        }
      default:
        return {
          title: 'Booking Incomplete',
          message: 'Something went wrong with your booking.',
          icon: <AlertTriangle className="h-16 w-16 text-orange-500" />,
          variant: 'warning' as const,
          showRetry: true,
          actionText: 'Try again'
        }
    }
  }

  const reasonInfo = getReasonInfo(reason)

  /**
   * Handle retry booking
   */
  const handleRetryBooking = () => {
    if (propertyId) {
      router.push(`/properties/${propertyId}`)
    } else {
      router.push('/search')
    }
  }

  /**
   * Handle contact support
   */
  const handleContactSupport = () => {
    // In production, this would open a support chat or email
    console.log('Opening support chat...')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="text-center mb-8">
              {reasonInfo.icon}
              <h1 className="mt-4 text-3xl font-bold text-gray-900">
                {reasonInfo.title}
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                {reasonInfo.message}
              </p>
              {sessionId && (
                <p className="mt-1 text-sm text-gray-500">
                  Session ID: {sessionId}
                </p>
              )}
            </div>

            {/* Booking Summary */}
            {bookingDetails && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Booking Attempt</CardTitle>
                  <CardDescription>
                    This is what you were trying to book
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {bookingDetails.propertyName}
                      </h3>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p>Check-in: {bookingDetails.checkIn}</p>
                        <p>Check-out: {bookingDetails.checkOut}</p>
                        <p>Guests: {bookingDetails.guests}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        ${bookingDetails.total}
                      </p>
                      <p className="text-sm text-gray-500">Total amount</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Retry Options */}
            {reasonInfo.showRetry && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>What would you like to do?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Button
                      onClick={handleRetryBooking}
                      size="lg"
                      className="w-full"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      {reasonInfo.actionText}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      asChild
                    >
                      <Link href="/search">
                        <Search className="mr-2 h-4 w-4" />
                        Browse other properties
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Troubleshooting */}
            {['payment_failed', 'insufficient_funds', 'card_declined'].includes(reason) && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Payment Troubleshooting</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900">Check your card details</p>
                        <p>Ensure your card number, expiry date, and CVV are correct</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900">Verify sufficient funds</p>
                        <p>Make sure your account has enough balance for this transaction</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900">Contact your bank</p>
                        <p>Your bank might have blocked the transaction for security</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900">Try a different card</p>
                        <p>Use another credit or debit card if available</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Help & Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleContactSupport}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Live Chat Support
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/help">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help Center
                  </Link>
                </Button>
                <div className="pt-3 border-t text-sm text-gray-600">
                  <p className="font-medium">Available 24/7</p>
                  <p>Our support team is here to help with any booking issues</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Navigation */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Homepage
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    My Dashboard
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/search">
                    <Search className="mr-2 h-4 w-4" />
                    Search Properties
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <div>
                <h4 className="font-medium">Payment Security</h4>
                <p className="text-sm mt-1">
                  No charges were made to your card. Your payment information is secure.
                </p>
              </div>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  )
}