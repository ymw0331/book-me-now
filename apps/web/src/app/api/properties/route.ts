import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, Property, CreatePropertyRequest, PaginatedResponse } from '@/types/api';

// Mock properties database
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

// GET /api/properties - List all properties with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const location = searchParams.get('location');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');

    let filteredProperties = [...mockProperties];

    // Apply filters
    if (location) {
      filteredProperties = filteredProperties.filter(property =>
        property.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (priceMin) {
      filteredProperties = filteredProperties.filter(property =>
        property.price >= parseInt(priceMin)
      );
    }

    if (priceMax) {
      filteredProperties = filteredProperties.filter(property =>
        property.price <= parseInt(priceMax)
      );
    }

    // Pagination
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
        message: 'Properties retrieved successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get properties error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// POST /api/properties - Create new property
export async function POST(request: NextRequest) {
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

    const body: CreatePropertyRequest = await request.json();
    const { title, content, location, price, from, to, bed } = body;

    // Validation
    if (!title || !content || !location || !price || !from || !to || !bed) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'All fields are required'
        },
        { status: 400 }
      );
    }

    if (price <= 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Price must be greater than 0'
        },
        { status: 400 }
      );
    }

    if (bed <= 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Number of beds must be greater than 0'
        },
        { status: 400 }
      );
    }

    // Create new property
    const newProperty: Property = {
      _id: `property_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: title.trim(),
      content: content.trim(),
      location: location.trim(),
      price,
      postedBy: userId,
      from,
      to,
      bed,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to mock database
    mockProperties.push(newProperty);

    return NextResponse.json<ApiResponse<Property>>(
      {
        success: true,
        data: newProperty,
        message: 'Property created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create property error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}