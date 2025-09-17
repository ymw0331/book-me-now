import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, User } from '@/types/api';

// Mock user database - should match the one from register/login
const mockUsers: any[] = [
  {
    _id: 'user_demo_123',
    name: 'Demo User',
    email: 'demo@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewFyLmEbT9bJ5x.G',
    stripe_account_id: '',
    stripe_seller: {},
    stripeSession: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Helper function to extract user ID from mock JWT token
function getUserIdFromToken(token: string): string | null {
  try {
    // Mock JWT format: jwt_userId_timestamp
    const parts = token.split('_');
    if (parts.length >= 3 && parts[0] === 'jwt') {
      return parts[1];
    }
    return null;
  } catch {
    return null;
  }
}

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

    // Extract user ID from token
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

    // Find user by ID
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

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json<ApiResponse<User>>(
      {
        success: true,
        data: userWithoutPassword,
        message: 'User profile retrieved successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get user profile error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}