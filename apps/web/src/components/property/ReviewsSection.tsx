'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@book-me-now/ui'
import { PropertyReview } from '@/types/property'

interface ReviewsSectionProps {
  propertyId: string
}

// Mock reviews data - replace with actual API call
const mockReviews: PropertyReview[] = [
  {
    _id: '1',
    user: {
      _id: 'user1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      avatar: '/api/user/avatar/user1'
    },
    property: 'property1',
    rating: 5,
    comment: 'Amazing place! The location was perfect and the host was very responsive. The apartment was exactly as described and very clean. Would definitely stay here again!',
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    _id: '2',
    user: {
      _id: 'user2',
      name: 'Michael Chen',
      email: 'michael@example.com'
    },
    property: 'property1',
    rating: 4,
    comment: 'Great stay overall. The place is well-located and comfortable. Only minor issue was the Wi-Fi was a bit slow, but everything else was perfect.',
    createdAt: '2024-01-05T00:00:00Z'
  },
  {
    _id: '3',
    user: {
      _id: 'user3',
      name: 'Emma Wilson',
      email: 'emma@example.com'
    },
    property: 'property1',
    rating: 5,
    comment: 'Absolutely loved our stay! The apartment is beautiful and exactly as shown in the photos. The host went above and beyond to make sure we had everything we needed.',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: '4',
    user: {
      _id: 'user4',
      name: 'David Rodriguez',
      email: 'david@example.com'
    },
    property: 'property1',
    rating: 5,
    comment: 'Perfect location for exploring the city. Clean, comfortable, and the host provided great recommendations for local restaurants and attractions.',
    createdAt: '2023-12-28T00:00:00Z'
  }
]

export default function ReviewsSection({ propertyId }: ReviewsSectionProps) {
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [reviews] = useState<PropertyReview[]>(mockReviews)

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3)

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0'

  const ratingCounts = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-sm ${
          index < rating ? 'text-yellow-500' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ))
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📝</div>
            <p>No reviews yet</p>
            <p className="text-sm mt-1">Be the first to review this property!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span>⭐ {averageRating}</span>
            <span className="text-base font-normal text-gray-600">
              · {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Rating Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center text-sm">
                <span className="w-4">{rating}</span>
                <span className="mx-2">★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                  <div
                    className="bg-gray-800 h-2 rounded-full"
                    style={{
                      width: `${reviews.length > 0 ? (ratingCounts[rating as keyof typeof ratingCounts] / reviews.length) * 100 : 0}%`
                    }}
                  />
                </div>
                <span className="w-6 text-right">
                  {ratingCounts[rating as keyof typeof ratingCounts]}
                </span>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {averageRating}
              </div>
              <div className="text-sm text-gray-600">Overall rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {Math.round((ratingCounts[5] / reviews.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">5-star reviews</div>
            </div>
          </div>
        </div>

        {/* Individual Reviews */}
        <div className="space-y-6">
          {displayedReviews.map((review) => (
            <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
              <div className="flex items-start space-x-3">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  {review.user.avatar ? (
                    <img
                      src={review.user.avatar}
                      alt={review.user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-semibold">
                      {review.user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900">
                      {review.user.name}
                    </h4>
                    <Badge variant="secondary" className="text-xs">
                      {formatDate(review.createdAt)}
                    </Badge>
                  </div>

                  <div className="flex items-center mb-2">
                    {renderStars(review.rating)}
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More/Less Button */}
        {reviews.length > 3 && (
          <div className="text-center pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setShowAllReviews(!showAllReviews)}
            >
              {showAllReviews
                ? 'Show less reviews'
                : `Show all ${reviews.length} reviews`
              }
            </Button>
          </div>
        )}

        {/* Write a Review Section */}
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <h4 className="font-medium text-gray-900 mb-2">
            Have you stayed here?
          </h4>
          <p className="text-gray-600 text-sm mb-4">
            Share your experience to help other travelers
          </p>
          <Button variant="outline">
            Write a review
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}