import Link from 'next/link'
import { 
  Container, 
  Jumbotron, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Badge, 
  Button, 
  Input 
} from '@book-me-now/ui'
import { MapPin, Star, Calendar, Users } from 'lucide-react'

/**
 * Hotel Homepage - Server Component
 * 
 * This is a SERVER COMPONENT that runs on the server!
 * Benefits:
 * - No loading states needed (data fetched during render)
 * - Perfect SEO (content rendered server-side)
 * - Fast performance (no client-server round trips)
 * - Zero JavaScript sent to client for static content
 */
export default async function HomePage() {
  // This runs on the SERVER during build/request time
  // Later this will fetch from DynamoDB, but for now we'll use mock data
  const featuredHotels = await getFeaturedHotels()
  const stats = await getStats()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Jumbotron variant="gradient">
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Find Your Perfect Stay
          </h1>
          <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto">
            Discover amazing hotels worldwide. From boutique properties to luxury resorts.
            Book with confidence and create unforgettable memories.
          </p>
          
          {/* Search Form */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                  <Input
                    placeholder="Where do you want to go?"
                    className="h-12 text-gray-900 placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <Input
                    type="date"
                    className="h-12 text-gray-900"
                  />
                </div>
                <div>
                  <Button size="lg" className="w-full h-12">
                    Search Hotels
                  </Button>
                </div>
              </div>
            </div>
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

      {/* Featured Hotels Section */}
      <div className="bg-gray-50 py-16">
        <Container>
          <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Properties
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Handpicked hotels offering exceptional experiences and unparalleled service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredHotels.map((hotel) => (
            <Card key={hotel.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-[4/3] bg-gray-200">
                <img
                  src={hotel.image}
                  alt={hotel.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg">{hotel.title}</CardTitle>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600">
                      ${hotel.price}
                    </div>
                    <div className="text-sm text-gray-500">per night</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <Badge variant="secondary">{hotel.location}</Badge>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{hotel.rating}</span>
                  <span className="text-sm text-gray-500">({hotel.reviews} reviews)</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {hotel.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{hotel.maxGuests} guests</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Available</span>
                    </div>
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/hotels/${hotel.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/hotels">
                Explore All Hotels
              </Link>
            </Button>
          </div>
        </Container>
      </div>
    </div>
  )
}

/**
 * Mock data function - simulates database call
 * 
 * In production, this would:
 * - Connect to DynamoDB
 * - Use proper caching with Next.js
 * - Handle errors gracefully
 * - Include proper TypeScript interfaces
 * 
 * Benefits of Server Components:
 * - This function runs on the server
 * - No API route needed
 * - No loading states in UI
 * - Perfect for SEO
 */
async function getFeaturedHotels() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  return [
    {
      id: '1',
      title: 'Marina Bay Luxury Hotel',
      location: 'Singapore',
      price: 299,
      rating: 4.8,
      reviews: 1247,
      maxGuests: 4,
      image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&w=800&q=80',
      description: 'Experience luxury at its finest with stunning marina views, world-class amenities, and exceptional service in the heart of Singapore.'
    },
    {
      id: '2',
      title: 'Sunset Beach Resort',
      location: 'Bali, Indonesia',
      price: 189,
      rating: 4.6,
      reviews: 892,
      maxGuests: 6,
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&w=800&q=80',
      description: 'Tropical paradise with pristine beaches, infinity pools, and authentic Indonesian culture. Perfect for romantic getaways and family vacations.'
    },
    {
      id: '3',
      title: 'Mountain View Lodge',
      location: 'Kyoto, Japan',
      price: 245,
      rating: 4.9,
      reviews: 634,
      maxGuests: 2,
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&w=800&q=80',
      description: 'Traditional Japanese hospitality meets modern comfort. Serene mountain views, zen gardens, and authentic kaiseki dining experiences.'
    }
  ]
}

/**
 * Mock stats function
 * Later this would aggregate real data from your booking database
 */
async function getStats() {
  return {
    hotels: 15420,
    cities: 1250,
    bookings: 89430,
    countries: 94
  }
}
