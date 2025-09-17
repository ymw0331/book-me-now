import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, Property, PaginatedResponse } from '@/types/api';

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
  }
];

// Helper function to extract user ID from token
function getUserIdFromToken(token: string): string | null {
  try {
    const parts = token.split('_');
    if (parts.length >= 3 && parts[0] === 'jwt') {
      return parts[1];
    }
    return null;
  } catch {
    return null;
  }
}

// GET /api/properties/user - Get user's properties
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Authorization token required'
        },
        { status: 401 }
      );
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Invalid token'
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Filter properties by user
    const userProperties = mockProperties.filter(property => property.postedBy === userId);

    // Sort by creation date (newest first)
    userProperties.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProperties = userProperties.slice(startIndex, endIndex);

    return NextResponse.json<PaginatedResponse<Property>>(
      {
        success: true,
        data: paginatedProperties,
        pagination: {
          page,
          limit,
          total: userProperties.length,
          totalPages: Math.ceil(userProperties.length / limit)
        },
        message: 'User properties retrieved successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get user properties error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}