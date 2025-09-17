import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, StripeAccount } from '@/types/api';

// Mock users database
const mockUsers = [
  {
    _id: 'user_demo_123',
    name: 'Demo User',
    email: 'demo@example.com',
    stripe_account_id: 'acct_1MockStripeAccount123',
    stripe_seller: {
      id: 'acct_1MockStripeAccount123',
      charges_enabled: true,
      details_submitted: true,
      payouts_enabled: true
    }
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

// GET /api/stripe/account - Get user's Stripe account status
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

    // Check if user has Stripe account
    if (!user.stripe_account_id) {
      return NextResponse.json<ApiResponse<{ hasAccount: boolean }>>(
        {
          success: true,
          data: {
            hasAccount: false
          },
          message: 'User does not have a Stripe account'
        },
        { status: 200 }
      );
    }

    // Mock Stripe account details
    const mockAccount: StripeAccount = {
      id: user.stripe_account_id,
      charges_enabled: user.stripe_seller?.charges_enabled || false,
      details_submitted: user.stripe_seller?.details_submitted || false,
      payouts_enabled: user.stripe_seller?.payouts_enabled || false
    };

    return NextResponse.json<ApiResponse<{ hasAccount: boolean; account: StripeAccount }>>(
      {
        success: true,
        data: {
          hasAccount: true,
          account: mockAccount
        },
        message: 'Stripe account details retrieved successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get Stripe account error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}