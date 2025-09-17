import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, Property, UpdatePropertyRequest } from '@/types/api';

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

// GET /api/properties/[id] - Get single property
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const property = mockProperties.find(p => p._id === id);
    if (!property) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Property not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Property>>(
      {
        success: true,
        data: property,
        message: 'Property retrieved successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get property error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// PUT /api/properties/[id] - Update property
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const propertyIndex = mockProperties.findIndex(p => p._id === id);
    if (propertyIndex === -1) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Property not found'
        },
        { status: 404 }
      );
    }

    const property = mockProperties[propertyIndex];

    // Check if user owns the property
    if (property.postedBy !== userId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Unauthorized: You can only update your own properties'
        },
        { status: 403 }
      );
    }

    const body: UpdatePropertyRequest = await request.json();
    const { title, content, location, price, from, to, bed } = body;

    // Update only provided fields
    const updatedProperty: Property = {
      ...property,
      ...(title && { title: title.trim() }),
      ...(content && { content: content.trim() }),
      ...(location && { location: location.trim() }),
      ...(price && { price }),
      ...(from && { from }),
      ...(to && { to }),
      ...(bed && { bed }),
      updatedAt: new Date().toISOString()
    };

    // Validation for updated fields
    if (updatedProperty.price <= 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Price must be greater than 0'
        },
        { status: 400 }
      );
    }

    if (updatedProperty.bed <= 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Number of beds must be greater than 0'
        },
        { status: 400 }
      );
    }

    // Save updated property
    mockProperties[propertyIndex] = updatedProperty;

    return NextResponse.json<ApiResponse<Property>>(
      {
        success: true,
        data: updatedProperty,
        message: 'Property updated successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update property error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/properties/[id] - Delete property
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const propertyIndex = mockProperties.findIndex(p => p._id === id);
    if (propertyIndex === -1) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Property not found'
        },
        { status: 404 }
      );
    }

    const property = mockProperties[propertyIndex];

    // Check if user owns the property
    if (property.postedBy !== userId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Unauthorized: You can only delete your own properties'
        },
        { status: 403 }
      );
    }

    // Remove property from array
    mockProperties.splice(propertyIndex, 1);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: 'Property deleted successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete property error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}