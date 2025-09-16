import Link from 'next/link'
import {
  Container,
  Jumbotron,
  PropertyCard,
  SearchBar,
  Button
} from '@book-me-now/ui'
import { Home, Briefcase, Globe, Shield } from 'lucide-react'

export default async function HomePage() {
  const featuredProperties = await getFeaturedProperties()
  const stats = await getStats()
  const categories = await getCategories()

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
              value={{
                location: '',
                guests: 1,
                bedrooms: 1
              }}
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
            <div className="text-3xl font-bold text-blue-600">{stats.cities.toLocaleString()}</div>
            <p className="text-gray-600">Cities & Destinations</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">{stats.bookings.toLocaleString()}</div>
            <p className="text-gray-600">Happy Customers</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">{stats.countries}</div>
            <p className="text-gray-600">Countries</p>
          </div>
        </div>
      </Container>

      {/* Category Filters */}
      <div className="bg-gray-50 py-12">
        <Container>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Explore by property type</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/search?type=${category.slug}`}
                className="group"
              >
                <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 text-blue-600">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {category.count} properties
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </div>

      {/* Featured Properties Section */}
      <Container className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Properties
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Handpicked hotels offering exceptional experiences and unparalleled service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={{
                _id: property.id,
                title: property.title,
                location: property.location,
                price: property.price,
                content: `Stunning ${property.title} in ${property.location}`,
                bed: 2,
                from: new Date().toISOString().split('T')[0],
                rating: property.rating,
                reviewCount: property.reviews,
                isSuperhostProperty: property.isSuperhost,
                isFavorited: property.isFavorite,
                image: { contentType: 'image/jpeg' }
              }}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/properties">
              Explore All Properties
            </Link>
          </Button>
        </div>
      </Container>

      {/* Live Anywhere Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <Container>
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Live anywhere
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white">
                <Home className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Entire homes</h3>
              <p className="text-gray-600">Comfortable private places, with room for friends or family.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white">
                <Globe className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Unique stays</h3>
              <p className="text-gray-600">Spaces that are more than just a place to sleep.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white">
                <Briefcase className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Business travel</h3>
              <p className="text-gray-600">Work-friendly stays with fast wifi and dedicated workspaces.</p>
            </div>
          </div>
        </Container>
      </div>

      {/* Trust Indicators */}
      <Container className="py-16">
        <div className="bg-gray-50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why book with us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-lg font-semibold mb-2">Secure Booking</h3>
              <p className="text-gray-600">Your payment information is encrypted and secure</p>
            </div>
            <div className="text-center">
              <Globe className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock assistance for all your travel needs</p>
            </div>
            <div className="text-center">
              <Home className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-lg font-semibold mb-2">Verified Properties</h3>
              <p className="text-gray-600">All properties are verified for quality and authenticity</p>
            </div>
          </div>
        </div>
      </Container>

      {/* Newsletter Section */}
      <div className="bg-blue-600 py-16">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Get exclusive deals
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about special offers and new properties
            </p>
            <form className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </Container>
      </div>
    </div>
  )
}

async function getFeaturedProperties() {
  await new Promise(resolve => setTimeout(resolve, 100))

  return [
    {
      id: '1',
      title: 'Marina Bay Luxury Hotel',
      location: 'Singapore',
      price: 299,
      rating: 4.8,
      reviews: 1247,
      image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&w=800&q=80',
      isSuperhost: true,
      isFavorite: false
    },
    {
      id: '2',
      title: 'Sunset Beach Resort',
      location: 'Bali, Indonesia',
      price: 189,
      rating: 4.6,
      reviews: 892,
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&w=800&q=80',
      isSuperhost: false,
      isFavorite: true
    },
    {
      id: '3',
      title: 'Mountain View Lodge',
      location: 'Kyoto, Japan',
      price: 245,
      rating: 4.9,
      reviews: 634,
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&w=800&q=80',
      isSuperhost: true,
      isFavorite: false
    },
    {
      id: '4',
      title: 'Urban Boutique Hotel',
      location: 'New York, USA',
      price: 325,
      rating: 4.7,
      reviews: 1523,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&w=800&q=80',
      isSuperhost: false,
      isFavorite: false
    },
    {
      id: '5',
      title: 'Coastal Paradise Villa',
      location: 'Santorini, Greece',
      price: 410,
      rating: 4.9,
      reviews: 428,
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&w=800&q=80',
      isSuperhost: true,
      isFavorite: true
    },
    {
      id: '6',
      title: 'Desert Oasis Resort',
      location: 'Dubai, UAE',
      price: 550,
      rating: 4.8,
      reviews: 967,
      image: 'https://images.unsplash.com/photo-1606046604972-77cc76aee944?ixlib=rb-4.0.3&w=800&q=80',
      isSuperhost: true,
      isFavorite: false
    }
  ]
}

async function getStats() {
  return {
    hotels: 15420,
    cities: 1250,
    bookings: 89430,
    countries: 94
  }
}

async function getCategories() {
  return [
    {
      id: 'entire-home',
      name: 'Entire homes',
      slug: 'entire-home',
      count: 5234,
      icon: <Home className="w-full h-full" />
    },
    {
      id: 'private-room',
      name: 'Private rooms',
      slug: 'private-room',
      count: 3421,
      icon: <Briefcase className="w-full h-full" />
    },
    {
      id: 'boutique',
      name: 'Boutique hotels',
      slug: 'boutique',
      count: 2156,
      icon: <Globe className="w-full h-full" />
    },
    {
      id: 'luxury',
      name: 'Luxury stays',
      slug: 'luxury',
      count: 1893,
      icon: <Shield className="w-full h-full" />
    }
  ]
}