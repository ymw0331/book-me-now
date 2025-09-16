import * as React from "react"
import { cn } from "@book-me-now/utils"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Badge } from "./badge"
import { Calendar, MapPin, Users, CreditCard, Clock } from "lucide-react"

interface BookingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  booking: {
    id: string
    propertyName: string
    propertyImage?: string
    location: string
    checkIn: string
    checkOut: string
    guests: number
    totalPrice: number
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
    bookingDate?: string
    paymentMethod?: string
  }
  onView?: (id: string) => void
  onCancel?: (id: string) => void
  onModify?: (id: string) => void
  compact?: boolean
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
}

const BookingCard = React.forwardRef<HTMLDivElement, BookingCardProps>(
  ({ className, booking, onView, onCancel, onModify, compact = false, ...props }, ref) => {
    const nights = React.useMemo(() => {
      const checkIn = new Date(booking.checkIn)
      const checkOut = new Date(booking.checkOut)
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }, [booking.checkIn, booking.checkOut])

    if (compact) {
      return (
        <Card ref={ref} className={cn("hover:shadow-lg transition-all", className)} {...props}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-sm">{booking.propertyName}</h4>
              <Badge variant="secondary" className={cn("text-xs", statusColors[booking.status])}>
                {booking.status}
              </Badge>
            </div>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {booking.checkIn} - {booking.checkOut}
              </div>
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {booking.location}
              </div>
            </div>
            <div className="mt-2 pt-2 border-t flex items-center justify-between">
              <span className="font-semibold text-sm">${booking.totalPrice}</span>
              {onView && (
                <button
                  onClick={() => onView(booking.id)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  View Details
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card ref={ref} className={cn("hover:shadow-xl transition-all", className)} {...props}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{booking.propertyName}</CardTitle>
              <p className="text-sm text-gray-600 flex items-center mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                {booking.location}
              </p>
            </div>
            <Badge variant="secondary" className={statusColors[booking.status]}>
              {booking.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {booking.propertyImage && (
            <img
              src={booking.propertyImage}
              alt={booking.propertyName}
              className="w-full h-48 object-cover rounded-lg"
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <div>
                  <p className="font-medium">Check-in</p>
                  <p className="text-gray-600">{booking.checkIn}</p>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <div>
                  <p className="font-medium">Check-out</p>
                  <p className="text-gray-600">{booking.checkOut}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2 text-gray-400" />
                <div>
                  <p className="font-medium">Guests</p>
                  <p className="text-gray-600">{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</p>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                <div>
                  <p className="font-medium">Duration</p>
                  <p className="text-gray-600">{nights} {nights === 1 ? 'night' : 'nights'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Amount</span>
              <span className="text-xl font-bold">${booking.totalPrice}</span>
            </div>
            {booking.paymentMethod && (
              <div className="flex items-center text-sm text-gray-600">
                <CreditCard className="h-3 w-3 mr-1" />
                {booking.paymentMethod}
              </div>
            )}
            {booking.bookingDate && (
              <p className="text-xs text-gray-500 mt-1">
                Booked on {booking.bookingDate}
              </p>
            )}
          </div>

          {(onView || onModify || onCancel) && (
            <div className="flex gap-2 pt-2">
              {onView && (
                <button
                  onClick={() => onView(booking.id)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  View Details
                </button>
              )}
              {onModify && booking.status === 'confirmed' && (
                <button
                  onClick={() => onModify(booking.id)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Modify
                </button>
              )}
              {onCancel && (booking.status === 'pending' || booking.status === 'confirmed') && (
                <button
                  onClick={() => onCancel(booking.id)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }
)

BookingCard.displayName = "BookingCard"

export { BookingCard }