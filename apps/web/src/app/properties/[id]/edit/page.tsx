'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge } from '@book-me-now/ui'
import { Property, PropertyFormData } from '@/types/property'
import PropertyForm from '@/components/property/PropertyForm'
import ImageUpload from '@/components/property/ImageUpload'
import { toast } from 'sonner'

interface EditPropertyPageProps {
  params: { id: string }
}

// Mock function - replace with actual API call
async function getProperty(id: string): Promise<Property | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  return {
    _id: id,
    title: 'Luxurious Downtown Apartment',
    content: 'Beautiful 2-bedroom apartment in the heart of the city with stunning views and modern amenities.',
    location: {
      address: '123 Marina Bay Street',
      city: 'Singapore',
      country: 'Singapore',
      coordinates: { lat: 1.2966, lng: 103.8558 }
    },
    price: 250,
    from: '2024-01-15',
    to: '2024-01-30',
    bed: 2,
    images: ['/api/property/image/' + id],
    postedBy: {
      _id: 'host123',
      name: 'John Smith',
      email: 'john@example.com'
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

// Mock function - replace with actual API call
async function updateProperty(id: string, formData: FormData): Promise<Property> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Mock response
  return {
    _id: id,
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    location: {
      address: formData.get('location') as string,
      city: 'Singapore',
      country: 'Singapore'
    },
    price: Number(formData.get('price')),
    from: formData.get('from') as string,
    to: formData.get('to') as string,
    bed: Number(formData.get('bed')),
    postedBy: {
      _id: 'host123',
      name: 'John Smith',
      email: 'john@example.com'
    },
    createdAt: '2024-01-01',
    updatedAt: new Date().toISOString()
  }
}

export default function EditPropertyPage({ params }: EditPropertyPageProps) {
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  // Form state
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    content: '',
    location: '',
    price: '',
    from: '',
    to: '',
    bed: '',
    amenities: [],
    maxGuests: '',
    propertyType: 'apartment',
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    cancellationPolicy: ''
  })

  const [images, setImages] = useState<File[]>([])
  const [currentImages, setCurrentImages] = useState<string[]>([])

  // Load property data
  useEffect(() => {
    async function loadProperty() {
      try {
        const data = await getProperty(params.id)
        if (!data) {
          toast.error('Property not found')
          router.push('/properties')
          return
        }

        setProperty(data)
        setFormData({
          title: data.title,
          content: data.content,
          location: data.location.address,
          price: data.price.toString(),
          from: data.from,
          to: data.to,
          bed: data.bed.toString(),
          amenities: data.amenities || [],
          maxGuests: data.maxGuests?.toString() || '',
          propertyType: data.propertyType || 'apartment',
          checkInTime: data.checkInTime || '3:00 PM',
          checkOutTime: data.checkOutTime || '11:00 AM',
          cancellationPolicy: data.cancellationPolicy || ''
        })
        setCurrentImages(data.images || [])
      } catch (error) {
        toast.error('Failed to load property')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadProperty()
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const submitData = new FormData()

      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'amenities' && Array.isArray(value)) {
          submitData.append(key, JSON.stringify(value))
        } else if (value !== undefined && value !== null) {
          submitData.append(key, value.toString())
        }
      })

      // Add images
      images.forEach((image, index) => {
        submitData.append(`image_${index}`, image)
      })

      const updatedProperty = await updateProperty(params.id, submitData)
      toast.success(`${updatedProperty.title} has been updated successfully`)

      // Redirect to property view page
      router.push(`/properties/${params.id}`)
    } catch (error) {
      toast.error('Failed to update property')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property not found</h1>
          <Button onClick={() => router.push('/properties')}>
            Back to Properties
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
              <p className="text-gray-600 mt-2">Property: {property.title}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push(`/properties/${params.id}`)}
            >
              Cancel
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {Array.from({ length: totalSteps }, (_, index) => (
              <div key={index + 1} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index + 1 <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="ml-2 text-sm">
                  {index === 0 && 'Basic Info'}
                  {index === 1 && 'Details'}
                  {index === 2 && 'Images'}
                  {index === 3 && 'Review'}
                </div>
                {index < totalSteps - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-4 ${
                      index + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* Form Steps */}
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-8">

                  {/* Step 1: Basic Information */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                          Basic Information
                        </h3>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Property Title *
                        </label>
                        <Input
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Enter property title"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description *
                        </label>
                        <textarea
                          value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          placeholder="Describe your property"
                          rows={4}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location *
                        </label>
                        <Input
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="Enter property address"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Property Type
                          </label>
                          <select
                            value={formData.propertyType}
                            onChange={(e) => setFormData({
                              ...formData,
                              propertyType: e.target.value as PropertyFormData['propertyType']
                            })}
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="apartment">Apartment</option>
                            <option value="house">House</option>
                            <option value="villa">Villa</option>
                            <option value="condo">Condo</option>
                            <option value="hotel">Hotel</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price per night ($) *
                          </label>
                          <Input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            placeholder="0"
                            required
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Property Details */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                          Property Details
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Number of Bedrooms *
                          </label>
                          <Input
                            type="number"
                            value={formData.bed}
                            onChange={(e) => setFormData({ ...formData, bed: e.target.value })}
                            placeholder="0"
                            required
                            min="0"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Maximum Guests
                          </label>
                          <Input
                            type="number"
                            value={formData.maxGuests}
                            onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
                            placeholder="0"
                            min="0"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Available From *
                          </label>
                          <Input
                            type="date"
                            value={formData.from}
                            onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Available To *
                          </label>
                          <Input
                            type="date"
                            value={formData.to}
                            onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Check-in Time
                          </label>
                          <Input
                            type="time"
                            value={formData.checkInTime}
                            onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Check-out Time
                          </label>
                          <Input
                            type="time"
                            value={formData.checkOutTime}
                            onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cancellation Policy
                        </label>
                        <textarea
                          value={formData.cancellationPolicy}
                          onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
                          placeholder="Describe your cancellation policy"
                          rows={3}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Amenities
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                          {['WiFi', 'Air Conditioning', 'Kitchen', 'Pool', 'Gym', 'Parking', 'Pet Friendly', 'Washer/Dryer', 'TV', 'Balcony'].map((amenity) => (
                            <label key={amenity} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.amenities?.includes(amenity)}
                                onChange={(e) => {
                                  const amenities = formData.amenities || []
                                  if (e.target.checked) {
                                    setFormData({ ...formData, amenities: [...amenities, amenity] })
                                  } else {
                                    setFormData({ ...formData, amenities: amenities.filter(a => a !== amenity) })
                                  }
                                }}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Images */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                          Property Images
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Upload high-quality images of your property. The first image will be used as the main photo.
                        </p>
                      </div>

                      <ImageUpload
                        images={images}
                        currentImages={currentImages}
                        onImagesChange={setImages}
                        onCurrentImagesChange={setCurrentImages}
                      />
                    </div>
                  )}

                  {/* Step 4: Review & Submit */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                          Review & Submit
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Please review all information before updating your property.
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900">{formData.title}</h4>
                          <p className="text-sm text-gray-600">{formData.content}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Location:</span> {formData.location}
                          </div>
                          <div>
                            <span className="font-medium">Type:</span> {formData.propertyType}
                          </div>
                          <div>
                            <span className="font-medium">Price:</span> ${formData.price}/night
                          </div>
                          <div>
                            <span className="font-medium">Bedrooms:</span> {formData.bed}
                          </div>
                          <div>
                            <span className="font-medium">Max Guests:</span> {formData.maxGuests || 'Not specified'}
                          </div>
                          <div>
                            <span className="font-medium">Available:</span> {formData.from} to {formData.to}
                          </div>
                        </div>

                        {formData.amenities && formData.amenities.length > 0 && (
                          <div>
                            <span className="font-medium">Amenities:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {formData.amenities.map((amenity) => (
                                <Badge key={amenity} variant="secondary" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <span className="font-medium">Images:</span> {currentImages.length + images.length} images
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Current Images Preview */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Current Images</CardTitle>
                </CardHeader>
                <CardContent>
                  {currentImages.length > 0 ? (
                    <div className="space-y-2">
                      {currentImages.slice(0, 3).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Property ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      ))}
                      {currentImages.length > 3 && (
                        <div className="text-sm text-gray-600 text-center">
                          +{currentImages.length - 3} more images
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        📸
                      </div>
                      <p>No images uploaded</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            <div className="flex gap-4">
              {currentStep < totalSteps ? (
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={saving}>
                  {saving ? 'Updating...' : 'Update Property'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}