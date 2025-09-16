'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@book-me-now/ui'
import { Property } from '@/types/property'
import { formatCurrency, calculateDays } from '@/lib/utils'
import { toast } from 'sonner'

interface BookingWidgetProps {
  property: Property
}

export default function BookingWidget({ property }: BookingWidgetProps) {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('1')
  const [loading, setLoading] = useState(false)

  const totalDays = checkIn && checkOut ? calculateDays(checkIn, checkOut) : 0
  const subtotal = totalDays * property.price
  const serviceFee = subtotal * 0.1 // 10% service fee
  const totalPrice = subtotal + serviceFee

  const handleBooking = async () => {
    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates')
      return
    }

    if (Number(guests) > (property.maxGuests || 999)) {
      toast.error(`Maximum ${property.maxGuests} guests allowed`)
      return
    }

    setLoading(true)

    try {
      // Mock booking logic - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // In real app, this would redirect to Stripe checkout or payment page
      toast.success('Redirecting to payment...')

      // Mock redirect to payment
      console.log('Booking details:', {
        property: property._id,
        checkIn,
        checkOut,
        guests: Number(guests),
        totalPrice
      })
    } catch (error) {
      toast.error('Booking failed. Please try again.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const minCheckOut = checkIn || today

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">
            {formatCurrency(property.price)}<span className="text-base font-normal text-gray-600">/night</span>
          </CardTitle>
          {property.rating && (
            <div className="flex items-center text-sm">
              <span className="text-yellow-500">⭐</span>
              <span className="ml-1 font-medium">{property.rating}</span>
              <span className="ml-1 text-gray-600">({property.reviewCount})</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Date Selection */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              CHECK-IN
            </label>
            <Input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={today}
              max={property.to}
              className="text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              CHECK-OUT
            </label>
            <Input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={minCheckOut}
              max={property.to}
              className="text-sm"
            />
          </div>
        </div>

        {/* Guests Selection */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            GUESTS
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Array.from({ length: property.maxGuests || 8 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num} guest{num !== 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Availability Status */}
        <div className="text-center py-2">
          {property.isAvailable ? (
            <span className="text-green-600 text-sm font-medium">✓ Available for selected dates</span>
          ) : (
            <span className="text-red-600 text-sm font-medium">✗ Not available for selected dates</span>
          )}
        </div>

        {/* Book Button */}
        <Button
          onClick={handleBooking}
          disabled={!property.isAvailable || loading || !checkIn || !checkOut}
          className="w-full py-3 text-base font-semibold"
        >
          {loading ? 'Processing...' : property.isAvailable ? 'Reserve' : 'Not Available'}
        </Button>

        {/* Pricing Breakdown */}
        {totalDays > 0 && (
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>{formatCurrency(property.price)} x {totalDays} night{totalDays !== 1 ? 's' : ''}</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Service fee</span>
              <span>{formatCurrency(serviceFee)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="border-t pt-4 text-center">
          <p className="text-xs text-gray-600 mb-2">You won&apos;t be charged yet</p>
          <div className="flex justify-center space-x-4 text-xs text-gray-500">
            <span>🔒 Secure payment</span>
            <span>📞 24/7 support</span>
            <span>↩️ Free cancellation</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}