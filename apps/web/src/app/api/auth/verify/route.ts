import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types/api';
import { blacklistedTokens } from '../logout/route';

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

// Helper function to check if token is expired (mock implementation)
function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('_');
    if (parts.length >= 3 && parts[0] === 'jwt') {
      const timestamp = parseInt(parts[2]);
      const tokenAge = Date.now() - timestamp;
      // Mock expiry: 24 hours
      return tokenAge > 24 * 60 * 60 * 1000;
    }
    return true;
  } catch {
    return true;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Token is required'
        },
        { status: 400 }
      );
    }

    // Check if token is blacklisted
    if (blacklistedTokens.has(token)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Token has been revoked'
        },
        { status: 401 }
      );
    }

    // Check if token is expired
    if (isTokenExpired(token)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Token has expired'
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
          error: 'Invalid token format'
        },
        { status: 401 }
      );
    }

    return NextResponse.json<ApiResponse<{ userId: string; valid: boolean }>>(
      {
        success: true,
        data: {
          userId,
          valid: true
        },
        message: 'Token is valid'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}