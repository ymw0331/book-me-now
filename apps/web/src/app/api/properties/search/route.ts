import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, Property, PropertySearchQuery, PaginatedResponse } from '@/types/api';

// Mock properties database - should match the one from main properties route
const mockProperties: Property[] = [
  {
    _id: 'property_1',
    title: 'Luxury Beach Resort',
    content: 'Beautiful beachfront property with stunning ocean views, private beach access, and world-class amenities.',
    location: 'Malibu, California',
    price: 450,
    postedBy: 'user_demo_123',
    from: '2024-01-01',
    to: '2024-12-31',
    bed: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'property_2',
    title: 'Downtown City Apartment',
    content: 'Modern apartment in the heart of downtown with easy access to restaurants, shopping, and entertainment.',
    location: 'New York, NY',
    price: 280,
    postedBy: 'user_demo_123',
    from: '2024-01-01',
    to: '2024-12-31',
    bed: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'property_3',
    title: 'Mountain Cabin Retreat',
    content: 'Cozy cabin nestled in the mountains, perfect for a peaceful getaway with hiking trails nearby.',
    location: 'Aspen, Colorado',
    price: 320,
    postedBy: 'user_demo_123',
    from: '2024-01-01',
    to: '2024-12-31',
    bed: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'property_4',
    title: 'Urban Loft Space',
    content: 'Stylish loft in trendy neighborhood with exposed brick walls and modern amenities.',
    location: 'San Francisco, CA',
    price: 380,
    postedBy: 'user_demo_123',
    from: '2024-01-01',
    to: '2024-12-31',
    bed: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'property_5',
    title: 'Lakeside Villa',
    content: 'Spacious villa overlooking a serene lake with private dock and outdoor activities.',
    location: 'Lake Tahoe, Nevada',
    price: 520,
    postedBy: 'user_demo_123',
    from: '2024-01-01',
    to: '2024-12-31',
    bed: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Helper function to check date availability
function isDateAvailable(property: Property, checkIn: string, checkOut: string): boolean {
  const propFrom = new Date(property.from);
  const propTo = new Date(property.to);
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  return checkInDate >= propFrom && checkOutDate <= propTo;
}

// GET /api/properties/search - Advanced property search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query: PropertySearchQuery = {
      location: searchParams.get('location') || undefined,
      priceMin: searchParams.get('priceMin') ? parseInt(searchParams.get('priceMin')!) : undefined,
      priceMax: searchParams.get('priceMax') ? parseInt(searchParams.get('priceMax')!) : undefined,
      bed: searchParams.get('bed') ? parseInt(searchParams.get('bed')!) : undefined,
      from: searchParams.get('from') || undefined,
      to: searchParams.get('to') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10')
    };

    let filteredProperties = [...mockProperties];

    // Apply location filter
    if (query.location) {
      filteredProperties = filteredProperties.filter(property =>
        property.location.toLowerCase().includes(query.location!.toLowerCase()) ||
        property.title.toLowerCase().includes(query.location!.toLowerCase()) ||
        property.content.toLowerCase().includes(query.location!.toLowerCase())
      );
    }

    // Apply price range filter
    if (query.priceMin !== undefined) {
      filteredProperties = filteredProperties.filter(property =>
        property.price >= query.priceMin!
      );
    }

    if (query.priceMax !== undefined) {
      filteredProperties = filteredProperties.filter(property =>
        property.price <= query.priceMax!
      );
    }

    // Apply bed count filter
    if (query.bed !== undefined) {
      filteredProperties = filteredProperties.filter(property =>
        property.bed >= query.bed!
      );
    }

    // Apply date availability filter
    if (query.from && query.to) {
      filteredProperties = filteredProperties.filter(property =>
        isDateAvailable(property, query.from!, query.to!)
      );
    }

    // Sort by relevance (price ascending by default, can be enhanced)
    filteredProperties.sort((a, b) => a.price - b.price);

    // Pagination
    const page = query.page || 1;
    const limit = query.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

    return NextResponse.json<PaginatedResponse<Property>>(
      {
        success: true,
        data: paginatedProperties,
        pagination: {
          page,
          limit,
          total: filteredProperties.length,
          totalPages: Math.ceil(filteredProperties.length / limit)
        },
        message: `Found ${filteredProperties.length} properties matching your search criteria`
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Property search error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}