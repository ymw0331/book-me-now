import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, StripeSessionRequest } from '@/types/api';

// Mock properties database
const mockProperties = [
  {
    _id: 'property_1',
    title: 'Luxury Beach Resort',
    price: 450,
    postedBy: 'user_demo_123'
  },
  {
    _id: 'property_2',
    title: 'Downtown City Apartment',
    price: 280,
    postedBy: 'user_demo_123'
  },
  {
    _id: 'property_3',
    title: 'Mountain Cabin Retreat',
    price: 320,
    postedBy: 'user_demo_123'
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

// POST /api/stripe/create-session - Create Stripe checkout session
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

    const body: StripeSessionRequest = await request.json();
    const { hotelId } = body;

    if (!hotelId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Hotel ID is required'
        },
        { status: 400 }
      );
    }

    // Find the property
    const property = mockProperties.find(p => p._id === hotelId);
    if (!property) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Property not found'
        },
        { status: 404 }
      );
    }

    // Mock Stripe session creation
    const mockSession = {
      id: `cs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      object: 'checkout.session',
      amount_total: property.price * 100, // Stripe uses cents
      currency: 'usd',
      customer: userId,
      metadata: {
        hotelId: property._id,
        userId: userId
      },
      payment_status: 'unpaid',
      status: 'open',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/stripe/cancel`,
      url: `https://checkout.stripe.com/pay/cs_${Date.now()}_mock_url`,
      created: Math.floor(Date.now() / 1000),
      expires_at: Math.floor(Date.now() / 1000) + 86400 // 24 hours
    };

    return NextResponse.json<ApiResponse<any>>(
      {
        success: true,
        data: {
          session: mockSession,
          url: mockSession.url
        },
        message: 'Stripe checkout session created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create Stripe session error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}