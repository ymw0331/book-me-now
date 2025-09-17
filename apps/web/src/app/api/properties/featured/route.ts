import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, Property } from '@/types/api';

// Mock properties database - reuse from main route
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
    image: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'property_2',
    title: 'Downtown City Apartment',
    content: 'Modern apartment in the heart of the city, walking distance to major attractions, restaurants, and nightlife.',
    location: 'New York, NY',
    price: 280,
    postedBy: 'user_demo_456',
    from: '2024-02-01',
    to: '2024-12-31',
    bed: 1,
    image: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'property_3',
    title: 'Mountain Retreat Cabin',
    content: 'Cozy cabin nestled in the mountains, perfect for a peaceful getaway with hiking trails and scenic views.',
    location: 'Aspen, Colorado',
    price: 320,
    postedBy: 'user_demo_789',
    from: '2024-03-01',
    to: '2024-11-30',
    bed: 3,
    image: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'property_4',
    title: 'Seaside Villa',
    content: 'Luxurious villa with private pool, ocean views, and direct beach access. Perfect for families.',
    location: 'Miami Beach, Florida',
    price: 550,
    postedBy: 'user_demo_321',
    from: '2024-01-15',
    to: '2024-12-15',
    bed: 4,
    image: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'property_5',
    title: 'Urban Loft',
    content: 'Spacious loft in trendy neighborhood with exposed brick, high ceilings, and modern amenities.',
    location: 'San Francisco, CA',
    price: 380,
    postedBy: 'user_demo_654',
    from: '2024-02-15',
    to: '2024-12-31',
    bed: 2,
    image: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'property_6',
    title: 'Countryside Estate',
    content: 'Historic estate with beautiful gardens, wine cellar, and panoramic countryside views.',
    location: 'Napa Valley, California',
    price: 680,
    postedBy: 'user_demo_987',
    from: '2024-03-01',
    to: '2024-10-31',
    bed: 5,
    image: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET /api/properties/featured - Get featured properties
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '6', 10);

    // Return featured properties (first N properties)
    const featuredProperties = mockProperties.slice(0, limit);

    return NextResponse.json<ApiResponse<Property[]>>(
      {
        success: true,
        data: featuredProperties
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Failed to fetch featured properties'
      },
      { status: 500 }
    );
  }
}