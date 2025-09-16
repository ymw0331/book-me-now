'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge } from '@book-me-now/ui'
import { Property, PropertyFormData } from '@/types/property'
import ImageUpload from '@/components/property/ImageUpload'
import { toast } from 'sonner'

// Mock function - replace with actual API call
async function createProperty(formData: FormData): Promise<Property> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  const newId = Math.random().toString(36).substr(2, 9)

  return {
    _id: newId,
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
      _id: 'current-user',
      name: 'Current User',
      email: 'user@example.com'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isAvailable: true
  }
}

export default function NewPropertyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5

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
    cancellationPolicy: 'Free cancellation up to 24 hours before check-in'
  })

  const [images, setImages] = useState<File[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.title || !formData.content || !formData.location || !formData.price) {
      toast.error('Please fill in all required fields')
      return
    }

    if (images.length === 0) {
      toast.error('Please upload at least one image')
      return
    }

    setLoading(true)

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

      const newProperty = await createProperty(submitData)
      toast.success('Property created successfully!')

      // Redirect to the new property page
      router.push(`/properties/${newProperty._id}`)
    } catch (error) {
      toast.error('Failed to create property')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    // Basic validation for each step
    if (currentStep === 1 && (!formData.title || !formData.content)) {
      toast.error('Please fill in title and description')
      return
    }
    if (currentStep === 2 && (!formData.location || !formData.price)) {
      toast.error('Please fill in location and price')
      return
    }
    if (currentStep === 3 && (!formData.from || !formData.to || !formData.bed)) {
      toast.error('Please fill in availability dates and bedrooms')
      return
    }
    if (currentStep === 4 && images.length === 0) {
      toast.error('Please upload at least one image')
      return
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">List Your Property</h1>
              <p className="text-gray-600 mt-2">Create a new property listing</p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
            >
              Cancel
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Step Indicator */}
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
                <div className="ml-2 text-sm hidden sm:block">
                  {index === 0 && 'Basic Info'}
                  {index === 1 && 'Location & Price'}
                  {index === 2 && 'Details'}
                  {index === 3 && 'Photos'}
                  {index === 4 && 'Review & Publish'}
                </div>
                {index < totalSteps - 1 && (
                  <div
                    className={`w-8 sm:w-12 h-0.5 mx-2 sm:mx-4 ${
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

            {/* Main Form */}
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-8">

                  {/* Step 1: Basic Information */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                          Let's start with the basics
                        </h3>
                        <p className="text-gray-600">
                          Tell us about your property. You can edit these details later.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          What's the name of your property? *
                        </label>
                        <Input
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="e.g., Cozy Downtown Apartment"
                          className="text-lg"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Choose a catchy name that describes your property
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Describe your property *
                        </label>
                        <textarea
                          value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          placeholder="Describe what makes your property special. Mention the view, neighborhood, or unique features..."
                          rows={6}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          {formData.content.length}/500 characters
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Property Type
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          {[
                            { value: 'apartment', label: '🏢 Apartment', desc: 'Private unit in building' },
                            { value: 'house', label: '🏠 House', desc: 'Entire house' },
                            { value: 'villa', label: '🏖️ Villa', desc: 'Luxury villa' },
                            { value: 'condo', label: '🏙️ Condo', desc: 'Condominium unit' },
                            { value: 'hotel', label: '🏨 Hotel', desc: 'Hotel room' }
                          ].map((type) => (
                            <div
                              key={type.value}
                              onClick={() => setFormData({ ...formData, propertyType: type.value as any })}
                              className={`cursor-pointer p-4 rounded-lg border-2 text-center transition-all ${
                                formData.propertyType === type.value
                                  ? 'border-blue-600 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="text-2xl mb-2">{type.label.split(' ')[0]}</div>
                              <div className="text-sm font-medium">{type.label.split(' ')[1]}</div>
                              <div className="text-xs text-gray-500 mt-1">{type.desc}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Location & Pricing */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                          Where is your property located?
                        </h3>
                        <p className="text-gray-600">
                          Help guests find your place and set your pricing
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Property Address *
                        </label>
                        <Input
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="123 Main Street, City, Country"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Include street address, city, and country
                        </p>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <div className="text-blue-600 mr-3 mt-1">💡</div>
                          <div>
                            <h4 className="font-medium text-blue-900">Pricing Tips</h4>
                            <ul className="text-sm text-blue-800 mt-1 space-y-1">
                              <li>• Research similar properties in your area</li>
                              <li>• Consider seasonal pricing variations</li>
                              <li>• Start with competitive rates and adjust based on demand</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price per night (USD) *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 text-lg">$</span>
                          </div>
                          <Input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            placeholder="100"
                            className="pl-8 text-lg"
                            min="0"
                          />
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          You can always change this later
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Property Details */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                          Tell us about your space
                        </h3>
                        <p className="text-gray-600">
                          Share the key details about your property
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Number of Bedrooms *
                          </label>
                          <Input
                            type="number"
                            value={formData.bed}
                            onChange={(e) => setFormData({ ...formData, bed: e.target.value })}
                            placeholder="1"
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
                            placeholder="2"
                            min="1"
                          />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-4">
                          When is your property available?
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Available From *
                            </label>
                            <Input
                              type="date"
                              value={formData.from}
                              onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                              min={new Date().toISOString().split('T')[0]}
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
                              min={formData.from || new Date().toISOString().split('T')[0]}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-4">
                          What amenities do you offer?
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {[
                            { id: 'WiFi', label: '📶 WiFi', popular: true },
                            { id: 'Air Conditioning', label: '❄️ AC', popular: true },
                            { id: 'Kitchen', label: '🍳 Kitchen', popular: true },
                            { id: 'Pool', label: '🏊 Pool', popular: false },
                            { id: 'Gym', label: '💪 Gym', popular: false },
                            { id: 'Parking', label: '🅿️ Parking', popular: true },
                            { id: 'Pet Friendly', label: '🐕 Pet Friendly', popular: false },
                            { id: 'Washer/Dryer', label: '🧺 Laundry', popular: true },
                            { id: 'TV', label: '📺 TV', popular: true },
                            { id: 'Balcony', label: '🏞️ Balcony', popular: false }
                          ].map((amenity) => (
                            <label
                              key={amenity.id}
                              className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                                formData.amenities?.includes(amenity.id)
                                  ? 'border-blue-600 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={formData.amenities?.includes(amenity.id)}
                                onChange={(e) => {
                                  const amenities = formData.amenities || []
                                  if (e.target.checked) {
                                    setFormData({ ...formData, amenities: [...amenities, amenity.id] })
                                  } else {
                                    setFormData({ ...formData, amenities: amenities.filter(a => a !== amenity.id) })
                                  }
                                }}
                                className="sr-only"
                              />
                              <span className="text-lg mr-2">{amenity.label.split(' ')[0]}</span>
                              <span className="text-sm font-medium">
                                {amenity.label.split(' ').slice(1).join(' ')}
                              </span>
                              {amenity.popular && (
                                <Badge variant="secondary" className="ml-auto text-xs">
                                  Popular
                                </Badge>
                              )}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Photos */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                          Add photos of your property
                        </h3>
                        <p className="text-gray-600">
                          Photos help guests imagine themselves at your place. You can start with one and add more later.
                        </p>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <div className="text-amber-600 mr-3 mt-1">💡</div>
                          <div>
                            <h4 className="font-medium text-amber-900">Photo Tips</h4>
                            <ul className="text-sm text-amber-800 mt-1 space-y-1">
                              <li>• Use natural lighting when possible</li>
                              <li>• Show the most important spaces first</li>
                              <li>• Keep images bright and clean</li>
                              <li>• Include wide shots of rooms and close-ups of special features</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <ImageUpload
                        images={images}
                        currentImages={[]}
                        onImagesChange={setImages}
                        onCurrentImagesChange={() => {}}
                        showTips={true}
                      />
                    </div>
                  )}

                  {/* Step 5: Review & Publish */}
                  {currentStep === 5 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                          Review your listing
                        </h3>
                        <p className="text-gray-600">
                          Here's what we'll show to guests. Make sure everything looks good!
                        </p>
                      </div>

                      {/* Preview Card */}
                      <Card className="border-2 border-dashed border-blue-300 bg-blue-50">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <Badge variant="secondary">Preview</Badge>
                            <span className="text-2xl font-bold text-blue-600">
                              ${formData.price}/night
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              {images.length > 0 && (
                                <img
                                  src={URL.createObjectURL(images[0])}
                                  alt="Property preview"
                                  className="w-full h-48 object-cover rounded-lg mb-4"
                                />
                              )}
                            </div>

                            <div>
                              <h4 className="text-xl font-bold text-gray-900 mb-2">
                                {formData.title}
                              </h4>
                              <p className="text-gray-600 mb-4">
                                📍 {formData.location}
                              </p>
                              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                                {formData.content}
                              </p>
                              <div className="flex flex-wrap gap-2 mb-4">
                                <Badge variant="outline">{formData.bed} bed{Number(formData.bed) !== 1 ? 's' : ''}</Badge>
                                <Badge variant="outline">{formData.maxGuests} guests</Badge>
                                <Badge variant="outline">{formData.propertyType}</Badge>
                              </div>
                              {formData.amenities && formData.amenities.length > 0 && (
                                <div>
                                  <p className="text-sm font-medium text-gray-900 mb-2">Amenities:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {formData.amenities.slice(0, 4).map((amenity) => (
                                      <Badge key={amenity} variant="secondary" className="text-xs">
                                        {amenity}
                                      </Badge>
                                    ))}
                                    {formData.amenities.length > 4 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{formData.amenities.length - 4} more
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <div className="text-green-600 mr-3 mt-1">🎉</div>
                          <div>
                            <h4 className="font-medium text-green-900">Ready to publish?</h4>
                            <p className="text-sm text-green-800 mt-1">
                              Your listing will be live immediately. You can always edit the details later from your dashboard.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Tips & Progress */}
            <div className="lg:col-span-1">
              <div className="space-y-6 sticky top-8">
                {/* Progress Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Step {currentStep} of {totalSteps}</span>
                        <span>{Math.round(progressPercentage)}%</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className={`flex items-center ${currentStep >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
                          {currentStep >= 1 ? '✓' : '○'} Basic Information
                        </div>
                        <div className={`flex items-center ${currentStep >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
                          {currentStep >= 2 ? '✓' : '○'} Location & Pricing
                        </div>
                        <div className={`flex items-center ${currentStep >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
                          {currentStep >= 3 ? '✓' : '○'} Property Details
                        </div>
                        <div className={`flex items-center ${currentStep >= 4 ? 'text-green-600' : 'text-gray-400'}`}>
                          {currentStep >= 4 ? '✓' : '○'} Photos
                        </div>
                        <div className={`flex items-center ${currentStep >= 5 ? 'text-green-600' : 'text-gray-400'}`}>
                          {currentStep >= 5 ? '✓' : '○'} Review & Publish
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tips Card */}
                {currentStep < 5 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>💡 Tip</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-700">
                        {currentStep === 1 && "A great title and description help your property stand out. Focus on what makes your place special!"}
                        {currentStep === 2 && "Competitive pricing attracts more guests. You can always adjust your rates based on demand and seasonality."}
                        {currentStep === 3 && "Accurate details help set guest expectations. Be honest about your space and amenities."}
                        {currentStep === 4 && "High-quality photos are the most important factor for bookings. Take your time with this step!"}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
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
                  {currentStep === 4 ? 'Review Listing' : 'Continue'}
                </Button>
              ) : (
                <Button type="submit" disabled={loading} className="px-8">
                  {loading ? 'Publishing...' : 'Publish Listing'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}