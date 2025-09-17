import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types/api';

// Mock token blacklist - in production, use Redis or database
const blacklistedTokens = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (token) {
      // Add token to blacklist
      blacklistedTokens.add(token);
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: 'Logout successful'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// Export the blacklisted tokens set for use in other auth routes
export { blacklistedTokens };