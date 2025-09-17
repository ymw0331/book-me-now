'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Container,
  Jumbotron,
  PropertyCard,
  SearchBar,
  Button
} from '@book-me-now/ui'
import { Home, Briefcase, Globe, Shield, ArrowRight, Star, MapPin } from 'lucide-react'
import { useFeaturedProperties } from '@/hooks/useProperties'
import { usePropertySearch } from '@/hooks/useSearch'
import { toast } from 'sonner'

export default function HomePage() {
  const router = useRouter()
  const { data: featuredProperties, isLoading } = useFeaturedProperties()
  const { search } = usePropertySearch()

  const [searchValue, setSearchValue] = useState({
    location: '',
    checkIn: undefined as Date | undefined,
    checkOut: undefined as Date | undefined,
    guests: 1,
    bedrooms: 1
  })

  const handleSearch = (searchData?: any) => {
    const dataToSearch = searchData || searchValue

    if (!dataToSearch.location) {
      toast.error('Please enter a location')
      return
    }

    search({
      location: dataToSearch.location,
      bed: dataToSearch.bedrooms || 1
    })

    // Build query params
    const params = new URLSearchParams({
      location: dataToSearch.location,
      bed: String(dataToSearch.bedrooms || 1),
      guests: String(dataToSearch.guests || 1)
    })

    if (dataToSearch.checkIn) {
      params.append('checkIn', dataToSearch.checkIn.toISOString())
    }
    if (dataToSearch.checkOut) {
      params.append('checkOut', dataToSearch.checkOut.toISOString())
    }

    router.push(`/search?${params.toString()}`)
  }

  // Mock stats data - in production, this would come from an API
  const stats = {
    hotels: 25000,
    guests: 100000,
    countries: 120,
    reviews: 50000
  }

  const categories = [
    { name: 'Entire Homes', count: 8500, icon: Home },
    { name: 'Private Rooms', count: 12000, icon: Briefcase },
    { name: 'Boutique Hotels', count: 3500, icon: Globe },
    { name: 'Luxury Resorts', count: 1000, icon: Shield }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Search */}
      <Jumbotron variant="gradient">
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Find Your Perfect Stay
          </h1>
          <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto">
            Discover amazing hotels worldwide. From boutique properties to luxury resorts.
            Book with confidence and create unforgettable memories.
          </p>

          {/* Integrated Search Bar */}
          <div className="mt-12 max-w-4xl mx-auto">
            <SearchBar
              variant="expanded"
              value={searchValue}
              onSearch={handleSearch}
              onLocationChange={(location) => setSearchValue(prev => ({ ...prev, location }))}
            />
          </div>
        </div>
      </Jumbotron>

      {/* Stats Section */}
      <Container className="py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">{stats.hotels.toLocaleString()}</div>
            <p className="text-gray-600">Hotels Worldwide</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">{stats.guests.toLocaleString()}+</div>
            <p className="text-gray-600">Happy Guests</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">{stats.countries}</div>
            <p className="text-gray-600">Countries</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">{stats.reviews.toLocaleString()}</div>
            <p className="text-gray-600">Verified Reviews</p>
          </div>
        </div>
      </Container>

      {/* Categories Section */}
      <Container className="py-16 border-t">
        <h2 className="text-3xl font-bold mb-8 text-center">Explore by Category</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.name}
                href={`/search?type=${encodeURIComponent(category.name.toLowerCase())}`}
                className="group p-6 bg-white rounded-xl border hover:shadow-lg transition-shadow"
              >
                <Icon className="h-8 w-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                <p className="text-gray-500">{category.count.toLocaleString()} properties</p>
              </Link>
            )
          })}
        </div>
      </Container>

      {/* Featured Properties */}
      <Container className="py-16 border-t">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Featured Properties</h2>
          <Link href="/search" className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProperties?.slice(0, 4).map((property) => (
              <PropertyCard
                key={property._id}
                property={{
                  _id: property._id,
                  title: property.title,
                  content: property.content,
                  location: property.location,
                  price: property.price,
                  bed: property.bed,
                  image: property.image || `https://picsum.photos/400/300?random=${property._id}`,
                  from: property.from,
                  to: property.to,
                  postedBy: property.postedBy
                }}
                onFavorite={() => toast.info('Favorites coming soon!')}
              />
            ))}
            {/* Fallback properties if none from API */}
            {(!featuredProperties || featuredProperties.length === 0) && (
              <>
                <PropertyCard
                  property={{
                    _id: '1',
                    title: 'Luxury Downtown Loft',
                    content: 'Experience luxury living in the heart of downtown with stunning city views',
                    location: 'New York, NY',
                    price: 299,
                    bed: 2,
                    image: 'https://picsum.photos/400/300?random=1',
                    from: new Date().toISOString(),
                    to: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
                    postedBy: { _id: '1', name: 'John Host', email: 'host@example.com' }
                  }}
                  onFavorite={() => toast.info('Favorites coming soon!')}
                />
                <PropertyCard
                  property={{
                    _id: '2',
                    title: 'Beachfront Villa',
                    content: 'Wake up to ocean views in this stunning beachfront villa with private access',
                    location: 'Miami, FL',
                    price: 450,
                    bed: 3,
                    image: 'https://picsum.photos/400/300?random=2',
                    from: new Date().toISOString(),
                    to: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
                    postedBy: { _id: '2', name: 'Jane Host', email: 'host2@example.com' }
                  }}
                  onFavorite={() => toast.info('Favorites coming soon!')}
                />
                <PropertyCard
                  property={{
                    _id: '3',
                    title: 'Mountain Retreat',
                    content: 'Escape to the mountains in this luxurious retreat with panoramic views',
                    location: 'Aspen, CO',
                    price: 599,
                    bed: 4,
                    image: 'https://picsum.photos/400/300?random=3',
                    from: new Date().toISOString(),
                    to: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
                    postedBy: { _id: '3', name: 'Bob Host', email: 'host3@example.com' }
                  }}
                  onFavorite={() => toast.info('Favorites coming soon!')}
                />
                <PropertyCard
                  property={{
                    _id: '4',
                    title: 'Historic Townhouse',
                    content: 'Stay in a beautifully restored historic townhouse in the heart of Boston',
                    location: 'Boston, MA',
                    price: 225,
                    bed: 2,
                    image: 'https://picsum.photos/400/300?random=4',
                    from: new Date().toISOString(),
                    to: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
                    postedBy: { _id: '4', name: 'Alice Host', email: 'host4@example.com' }
                  }}
                  onFavorite={() => toast.info('Favorites coming soon!')}
                />
              </>
            )}
          </div>
        )}
      </Container>

      {/* Trust Indicators */}
      <Container className="py-16 border-t">
        <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Book Me Now</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure Booking</h3>
            <p className="text-gray-600">Your payments and personal information are always protected with our secure booking system.</p>
          </div>
          <div className="text-center">
            <Star className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Verified Reviews</h3>
            <p className="text-gray-600">Read genuine reviews from real guests who have stayed at our properties.</p>
          </div>
          <div className="text-center">
            <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Best Locations</h3>
            <p className="text-gray-600">Hand-picked properties in prime locations to ensure the best experience.</p>
          </div>
        </div>
      </Container>

      {/* Newsletter Signup */}
      <div className="bg-blue-600 text-white py-16">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-blue-100 mb-8">
              Get exclusive deals and travel inspiration delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900"
              />
              <Button
                variant="secondary"
                size="lg"
                onClick={() => toast.success('Newsletter subscription coming soon!')}
              >
                Subscribe
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}