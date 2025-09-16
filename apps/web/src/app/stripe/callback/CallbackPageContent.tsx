'use client'

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Home,
  Search,
  MessageCircle,
  HelpCircle,
  RotateCcw
} from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Alert,
  Badge
} from "@book-me-now/ui"

/**
 * Callback status types based on processing results
 */
type CallbackStatus = 'processing' | 'success' | 'error' | 'cancelled' | 'requires_action'

/**
 * Callback processing result
 */
interface CallbackResult {
  status: CallbackStatus
  message: string
  details?: string
  bookingId?: string
  sessionId?: string
  redirectUrl?: string
}

/**
 * Mock function to process callback parameters
 * In production, this would make API calls to verify payment status
 */
async function processCallback(searchParams: URLSearchParams): Promise<CallbackResult> {
  const sessionId = searchParams.get('session_id')
  const paymentIntent = searchParams.get('payment_intent')
  const paymentStatus = searchParams.get('payment_status')
  const source = searchParams.get('source')

  // Mock API processing delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Mock different scenarios based on parameters
  if (paymentStatus === 'succeeded') {
    return {
      status: 'success',
      message: 'Payment processed successfully!',
      details: 'Your booking has been confirmed.',
      bookingId: 'BK-2024-001567',
      sessionId,
      redirectUrl: `/stripe/success?session_id=${sessionId}`
    }
  }

  if (paymentStatus === 'cancelled') {
    return {
      status: 'cancelled',
      message: 'Payment was cancelled',
      details: 'You can try booking again at any time.',
      sessionId,
      redirectUrl: `/stripe/cancel?session_id=${sessionId}`
    }
  }

  if (paymentStatus === 'requires_action') {
    return {
      status: 'requires_action',
      message: 'Additional verification required',
      details: 'Please complete the payment verification process.',
      sessionId,
      redirectUrl: `/payment/verify?session_id=${sessionId}`
    }
  }

  if (!sessionId && !paymentIntent) {
    return {
      status: 'error',
      message: 'Invalid callback parameters',
      details: 'Missing required payment information.'
    }
  }

  // Default success scenario
  return {
    status: 'success',
    message: 'Processing completed',
    details: 'Your request has been processed successfully.',
    sessionId,
    redirectUrl: sessionId ? `/stripe/success?session_id=${sessionId}` : '/dashboard'
  }
}

/**
 * Loading state component
 */
function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Processing</h3>
              <p className="text-gray-600 mt-1">
                Please wait while we process your request...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Status display component
 */
interface StatusDisplayProps {
  result: CallbackResult
  onRetry: () => void
  onRedirect: () => void
}

function StatusDisplay({ result, onRetry, onRedirect }: StatusDisplayProps) {
  const getStatusConfig = (status: CallbackStatus) => {
    switch (status) {
      case 'success':
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-500" />,
          title: 'Success!',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          badgeVariant: 'default' as const,
          badgeText: 'Completed',
          showRedirect: true,
          showRetry: false
        }
      case 'error':
        return {
          icon: <XCircle className="h-16 w-16 text-red-500" />,
          title: 'Error',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          badgeVariant: 'destructive' as const,
          badgeText: 'Failed',
          showRedirect: false,
          showRetry: true
        }
      case 'cancelled':
        return {
          icon: <XCircle className="h-16 w-16 text-gray-400" />,
          title: 'Cancelled',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          badgeVariant: 'secondary' as const,
          badgeText: 'Cancelled',
          showRedirect: true,
          showRetry: true
        }
      case 'requires_action':
        return {
          icon: <AlertTriangle className="h-16 w-16 text-orange-500" />,
          title: 'Action Required',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          badgeVariant: 'outline' as const,
          badgeText: 'Pending',
          showRedirect: true,
          showRetry: false
        }
      default:
        return {
          icon: <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />,
          title: 'Processing',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          badgeVariant: 'outline' as const,
          badgeText: 'Processing',
          showRedirect: false,
          showRetry: false
        }
    }
  }

  const config = getStatusConfig(result.status)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className={`${config.bgColor} ${config.borderColor}`}>
              <CardContent className="p-8 text-center">
                <div className="space-y-6">
                  {/* Status Icon */}
                  <div className="flex justify-center">
                    {config.icon}
                  </div>

                  {/* Status Header */}
                  <div>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <h1 className="text-2xl font-bold text-gray-900">
                        {config.title}
                      </h1>
                      <Badge variant={config.badgeVariant}>
                        {config.badgeText}
                      </Badge>
                    </div>
                    <p className="text-lg text-gray-700">{result.message}</p>
                    {result.details && (
                      <p className="text-gray-600 mt-2">{result.details}</p>
                    )}
                  </div>

                  {/* Session Info */}
                  {result.sessionId && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500">
                        Session ID: {result.sessionId}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {config.showRedirect && result.redirectUrl && (
                      <Button onClick={onRedirect} size="lg">
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Continue
                      </Button>
                    )}
                    {config.showRetry && (
                      <Button onClick={onRetry} variant="outline" size="lg">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Try Again
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            {result.status === 'error' && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>What can you do?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900">Check your connection</p>
                        <p>Make sure you have a stable internet connection</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900">Try refreshing the page</p>
                        <p>Sometimes a simple refresh can resolve temporary issues</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900">Contact support</p>
                        <p>If the problem persists, our team is here to help</p>
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
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/help">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Contact Support
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/help/faq">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    FAQ
                  </Link>
                </Button>
                <div className="pt-3 border-t text-sm text-gray-600">
                  <p className="font-medium">Available 24/7</p>
                  <p>Our support team is here to help</p>
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
                    <ArrowRight className="mr-2 h-4 w-4" />
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
              <CheckCircle className="h-4 w-4" />
              <div>
                <h4 className="font-medium">Secure Processing</h4>
                <p className="text-sm mt-1">
                  All transactions are processed securely with industry-standard encryption.
                </p>
              </div>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Main Stripe Callback Page Content Component
 * Handles various callback scenarios from Stripe payments
 */
export default function CallbackPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Component state
  const [result, setResult] = React.useState<CallbackResult | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Process callback on mount
  React.useEffect(() => {
    const handleCallback = async () => {
      try {
        setLoading(true)
        setError(null)

        const callbackResult = await processCallback(searchParams)
        setResult(callbackResult)

        // Auto-redirect for successful payments after delay
        if (callbackResult.status === 'success' && callbackResult.redirectUrl) {
          setTimeout(() => {
            router.push(callbackResult.redirectUrl!)
          }, 3000)
        }
      } catch (error) {
        console.error('Callback processing failed:', error)
        setError('Failed to process callback')
        setResult({
          status: 'error',
          message: 'Processing failed',
          details: 'An unexpected error occurred while processing your request.'
        })
      } finally {
        setLoading(false)
      }
    }

    handleCallback()
  }, [searchParams, router])

  /**
   * Handle retry action
   */
  const handleRetry = () => {
    setLoading(true)
    setError(null)
    setResult(null)

    // Retry processing after a short delay
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  /**
   * Handle manual redirect
   */
  const handleRedirect = () => {
    if (result?.redirectUrl) {
      router.push(result.redirectUrl)
    } else {
      router.push('/dashboard')
    }
  }

  // Loading state
  if (loading) {
    return <LoadingState />
  }

  // Error state without result
  if (error && !result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <XCircle className="h-16 w-16 text-red-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Processing Error</h3>
                <p className="text-gray-600 mt-1">{error}</p>
              </div>
              <div className="space-y-2">
                <Button onClick={handleRetry} className="w-full">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main content with result
  if (result) {
    return (
      <StatusDisplay
        result={result}
        onRetry={handleRetry}
        onRedirect={handleRedirect}
      />
    )
  }

  // Fallback state
  return <LoadingState />
}