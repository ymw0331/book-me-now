import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, StripeConnectRequest } from '@/types/api';

// Mock users database
const mockUsers = [
  {
    _id: 'user_demo_123',
    name: 'Demo User',
    email: 'demo@example.com',
    stripe_account_id: '',
    stripe_seller: {}
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

// POST /api/stripe/connect - Create or retrieve Stripe Connect account
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

    // Find user
    const userIndex = mockUsers.findIndex(u => u._id === userId);
    if (userIndex === -1) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'User not found'
        },
        { status: 404 }
      );
    }

    const user = mockUsers[userIndex];

    // If user already has a Stripe account, return account link for onboarding
    if (user.stripe_account_id) {
      const accountLinkUrl = `https://connect.stripe.com/express/oauth/authorize?redirect_uri=${encodeURIComponent(
        `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/stripe/callback`
      )}&client_id=ca_mock_client_id&state=${userId}&stripe_user[email]=${user.email}`;

      return NextResponse.json<ApiResponse<{ accountId: string; accountLink: string }>>(
        {
          success: true,
          data: {
            accountId: user.stripe_account_id,
            accountLink: accountLinkUrl
          },
          message: 'Stripe account link generated successfully'
        },
        { status: 200 }
      );
    }

    // Create new Stripe account (mock implementation)
    const mockAccountId = `acct_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Update user with new Stripe account
    mockUsers[userIndex] = {
      ...user,
      stripe_account_id: mockAccountId,
      stripe_seller: {
        id: mockAccountId,
        charges_enabled: false,
        details_submitted: false,
        payouts_enabled: false
      }
    };

    // Generate account onboarding link
    const accountLinkUrl = `https://connect.stripe.com/express/oauth/authorize?redirect_uri=${encodeURIComponent(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/stripe/callback`
    )}&client_id=ca_mock_client_id&state=${userId}&stripe_user[email]=${user.email}&stripe_user[business_type]=individual`;

    return NextResponse.json<ApiResponse<{ accountId: string; accountLink: string }>>(
      {
        success: true,
        data: {
          accountId: mockAccountId,
          accountLink: accountLinkUrl
        },
        message: 'Stripe Connect account created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Stripe Connect error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// GET /api/stripe/connect - Get Stripe Connect onboarding status
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

    // Find user
    const user = mockUsers.find(u => u._id === userId);
    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'User not found'
        },
        { status: 404 }
      );
    }

    const hasStripeAccount = !!user.stripe_account_id;
    const isOnboardingComplete = hasStripeAccount &&
      user.stripe_seller?.charges_enabled &&
      user.stripe_seller?.details_submitted;

    return NextResponse.json<ApiResponse<{
      hasAccount: boolean;
      isOnboardingComplete: boolean;
      accountId?: string;
    }>>(
      {
        success: true,
        data: {
          hasAccount: hasStripeAccount,
          isOnboardingComplete,
          ...(hasStripeAccount && { accountId: user.stripe_account_id })
        },
        message: 'Stripe Connect status retrieved successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get Stripe Connect status error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}