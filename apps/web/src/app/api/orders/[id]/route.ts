import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, Order } from '@/types/api';

// Mock orders database - should match the one from main orders route
const mockOrders: Order[] = [
  {
    _id: 'order_1',
    hotel: 'property_1',
    session: {
      id: 'cs_test_session_123',
      amount_total: 45000,
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
      amount_total: 28000,
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

// GET /api/orders/[id] - Get single order
export async function GET(
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

    const order = mockOrders.find(o => o._id === id);
    if (!order) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Order not found'
        },
        { status: 404 }
      );
    }

    // Check if user owns the order
    if (order.orderedBy !== userId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Unauthorized: You can only view your own orders'
        },
        { status: 403 }
      );
    }

    // Populate hotel data
    const populatedOrder = {
      ...order,
      hotel: mockProperties.find(p => p._id === order.hotel) || order.hotel
    };

    return NextResponse.json<ApiResponse<Order>>(
      {
        success: true,
        data: populatedOrder,
        message: 'Order retrieved successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// PUT /api/orders/[id] - Update order (limited fields)
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

    const orderIndex = mockOrders.findIndex(o => o._id === id);
    if (orderIndex === -1) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Order not found'
        },
        { status: 404 }
      );
    }

    const order = mockOrders[orderIndex];

    // Check if user owns the order
    if (order.orderedBy !== userId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Unauthorized: You can only update your own orders'
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { session } = body;

    // Only allow updating session data (e.g., payment status)
    const updatedOrder: Order = {
      ...order,
      ...(session && { session: { ...order.session, ...session } }),
      updatedAt: new Date().toISOString()
    };

    // Save updated order
    mockOrders[orderIndex] = updatedOrder;

    // Populate hotel data for response
    const populatedOrder = {
      ...updatedOrder,
      hotel: mockProperties.find(p => p._id === updatedOrder.hotel) || updatedOrder.hotel
    };

    return NextResponse.json<ApiResponse<Order>>(
      {
        success: true,
        data: populatedOrder,
        message: 'Order updated successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/[id] - Cancel/delete order
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

    const orderIndex = mockOrders.findIndex(o => o._id === id);
    if (orderIndex === -1) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Order not found'
        },
        { status: 404 }
      );
    }

    const order = mockOrders[orderIndex];

    // Check if user owns the order
    if (order.orderedBy !== userId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Unauthorized: You can only cancel your own orders'
        },
        { status: 403 }
      );
    }

    // Check if order can be cancelled (e.g., not already paid)
    if (order.session?.payment_status === 'paid') {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Cannot cancel a paid order. Please contact support for refunds.'
        },
        { status: 400 }
      );
    }

    // Remove order from array
    mockOrders.splice(orderIndex, 1);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: 'Order cancelled successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete order error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}