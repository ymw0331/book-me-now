import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@book-me-now/ui'
import { Property } from '@/types/property'
import PropertyGallery from '@/components/property/PropertyGallery'
import BookingWidget from '@/components/property/BookingWidget'
import HostCard from '@/components/property/HostCard'
import ReviewsSection from '@/components/property/ReviewsSection'
import PropertyMap from '@/components/property/PropertyMap'
import { formatDate, calculateDays } from '@/lib/utils'

// This would normally come from your API
async function getProperty(id: string): Promise<Property | null> {
  // Mock data for now - replace with actual API call
  return {
    _id: id,
    title: 'Luxurious Downtown Apartment',
    content: 'Beautiful 2-bedroom apartment in the heart of the city with stunning views and modern amenities.',
    location: {
      address: '123 Marina Bay Street',
      city: 'Singapore',
      country: 'Singapore',
      coordinates: {
        lat: 1.2966,
        lng: 103.8558
      }
    },
    price: 250,
    from: '2024-01-15',
    to: '2024-01-30',
    bed: 2,
    images: [
      '/api/property/image/' + id,
      '/api/property/image/' + id + '/2',
      '/api/property/image/' + id + '/3'
    ],
    postedBy: {
      _id: 'host123',
      name: 'John Smith',
      email: 'john@example.com',
      avatar: '/api/user/avatar/host123'
    },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    amenities: ['WiFi', 'Air Conditioning', 'Kitchen', 'Pool', 'Gym'],
    maxGuests: 4,
    propertyType: 'apartment',
    rating: 4.8,
    reviewCount: 42,
    isAvailable: true,
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    cancellationPolicy: 'Free cancellation up to 24 hours before check-in'
  }
}

interface PropertyPageProps {
  params: { id: string }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const property = await getProperty(params.id)

  if (!property) {
    notFound()
  }

  const totalDays = calculateDays(property.from, property.to)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Gallery */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {property.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>📍 {property.location.city}, {property.location.country}</span>
              <span>⭐ {property.rating} ({property.reviewCount} reviews)</span>
              <Badge variant="success" className="text-xs">
                {property.isAvailable ? 'Available' : 'Unavailable'}
              </Badge>
            </div>
          </div>

          <Suspense fallback={<div className="h-96 bg-gray-200 rounded-lg animate-pulse" />}>
            <PropertyGallery images={property.images || []} title={property.title} />
          </Suspense>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-8">

            {/* Property Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Property Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{property.bed}</div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{property.maxGuests}</div>
                    <div className="text-sm text-gray-600">Max Guests</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{totalDays}</div>
                    <div className="text-sm text-gray-600">Days Available</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">${property.price}</div>
                    <div className="text-sm text-gray-600">Per Night</div>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {property.content}
                </p>
              </CardContent>
            </Card>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Availability & Policies */}
            <Card>
              <CardHeader>
                <CardTitle>Availability & Policies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Available Dates</h4>
                  <div className="flex items-center gap-4 text-sm">
                    <span>From: {formatDate(property.from)}</span>
                    <span>To: {formatDate(property.to)}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Check-in / Check-out</h4>
                  <div className="flex items-center gap-4 text-sm">
                    <span>Check-in: {property.checkInTime}</span>
                    <span>Check-out: {property.checkOutTime}</span>
                  </div>
                </div>

                {property.cancellationPolicy && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Cancellation Policy</h4>
                    <p className="text-sm text-gray-600">{property.cancellationPolicy}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Host Information */}
            <Suspense fallback={<div className="h-32 bg-gray-200 rounded-lg animate-pulse" />}>
              <HostCard host={property.postedBy} />
            </Suspense>

            {/* Map */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-gray-700">{property.location.address}</p>
                  <p className="text-gray-600">{property.location.city}, {property.location.country}</p>
                </div>
                <Suspense fallback={<div className="h-64 bg-gray-200 rounded-lg animate-pulse" />}>
                  <PropertyMap
                    coordinates={property.location.coordinates}
                    address={property.location.address}
                  />
                </Suspense>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Suspense fallback={<div className="h-96 bg-gray-200 rounded-lg animate-pulse" />}>
              <ReviewsSection propertyId={property._id} />
            </Suspense>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Suspense fallback={<div className="h-96 bg-gray-200 rounded-lg animate-pulse" />}>
                <BookingWidget property={property} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function generateMetadata({ params }: PropertyPageProps) {
  return {
    title: `Property ${params.id} | Book Me Now`,
    description: 'View property details and book your stay'
  }
}