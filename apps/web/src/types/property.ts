/**
 * Property data types for the Book Me Now application
 * Based on the legacy hotel structure but modernized
 */

export interface PropertyUser {
  _id: string
  name: string
  email: string
  avatar?: string
}

export interface PropertyLocation {
  address: string
  city: string
  country: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface Property {
  _id: string
  title: string
  content: string
  location: PropertyLocation
  price: number
  from: string
  to: string
  bed: number
  image?: string
  images?: string[]
  postedBy: PropertyUser
  createdAt: string
  updatedAt: string

  // Additional modern fields
  amenities?: string[]
  maxGuests?: number
  propertyType?: 'hotel' | 'apartment' | 'house' | 'villa' | 'condo'
  rating?: number
  reviewCount?: number
  isAvailable?: boolean
  cancellationPolicy?: string
  checkInTime?: string
  checkOutTime?: string
}

export interface PropertyFormData {
  title: string
  content: string
  location: string
  price: string
  from: string
  to: string
  bed: string
  image?: File
  images?: File[]
  amenities?: string[]
  maxGuests?: string
  propertyType?: Property['propertyType']
  cancellationPolicy?: string
  checkInTime?: string
  checkOutTime?: string
}

export interface PropertyReview {
  _id: string
  user: PropertyUser
  property: string
  rating: number
  comment: string
  createdAt: string
}

export interface BookingData {
  property: Property
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  user: PropertyUser
}

// API Response types
export interface PropertyResponse {
  data: Property
  success: boolean
  message?: string
}

export interface PropertiesResponse {
  data: Property[]
  success: boolean
  message?: string
  total?: number
  page?: number
  limit?: number
}