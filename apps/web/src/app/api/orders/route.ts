import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, Order, CreateOrderRequest, PaginatedResponse } from '@/types/api';

// Mock orders database
const mockOrders: Order[] = [
  {
    _id: 'order_1',
    hotel: 'property_1',
    session: {
      id: 'cs_test_session_123',
      amount_total: 45000, // $450.00 in cents
      currency: 'usd',
      payment_status: 'paid'
    },
    orderedBy: 'user_demo_123',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString()
  },
  {
    _id: 'order_2',
    hotel: 'property_2',
    session: {
      id: 'cs_test_session_456',
      amount_total: 28000, // $280.00 in cents
      currency: 'usd',
      payment_status: 'paid'
    },
    orderedBy: 'user_demo_123',
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-10').toISOString()
  }
];

// Mock properties for reference
const mockProperties = [
  {
    _id: 'property_1',
    title: 'Luxury Beach Resort',
    location: 'Malibu, California',
    price: 450
  },
  {
    _id: 'property_2',
    title: 'Downtown City Apartment',
    location: 'New York, NY',
    price: 280
  },
  {
    _id: 'property_3',
    title: 'Mountain Cabin Retreat',
    location: 'Aspen, Colorado',
    price: 320
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

// GET /api/orders - Get user's orders
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

    // Filter orders by user
    const userOrders = mockOrders.filter(order => order.orderedBy === userId);

    // Sort by creation date (newest first)
    userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Populate hotel data
    const populatedOrders = userOrders.map(order => ({
      ...order,
      hotel: mockProperties.find(p => p._id === order.hotel) || order.hotel
    }));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = populatedOrders.slice(startIndex, endIndex);

    return NextResponse.json<PaginatedResponse<Order>>(
      {
        success: true,
        data: paginatedOrders,
        pagination: {
          page,
          limit,
          total: userOrders.length,
          totalPages: Math.ceil(userOrders.length / limit)
        },
        message: 'Orders retrieved successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order
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

    const body: CreateOrderRequest = await request.json();
    const { hotel, session } = body;

    // Validation
    if (!hotel || !session) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Hotel and session are required'
        },
        { status: 400 }
      );
    }

    // Check if hotel exists
    const property = mockProperties.find(p => p._id === hotel);
    if (!property) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Property not found'
        },
        { status: 404 }
      );
    }

    // Create new order
    const newOrder: Order = {
      _id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      hotel,
      session,
      orderedBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to mock database
    mockOrders.push(newOrder);

    // Populate hotel data for response
    const populatedOrder = {
      ...newOrder,
      hotel: property
    };

    return NextResponse.json<ApiResponse<Order>>(
      {
        success: true,
        data: populatedOrder,
        message: 'Order created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}