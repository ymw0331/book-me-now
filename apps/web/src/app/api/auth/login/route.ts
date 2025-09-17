import { NextRequest, NextResponse } from 'next/server';
import { LoginRequest, ApiResponse, AuthResponse } from '@/types/api';
import bcrypt from 'bcryptjs';

// Mock user database - should match the one from register
const mockUsers: any[] = [
  // Pre-populate with demo user
  {
    _id: 'user_demo_123',
    name: 'Demo User',
    email: 'demo@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewFyLmEbT9bJ5x.G', // password: 'demo123'
    stripe_account_id: '',
    stripe_seller: {},
    stripeSession: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Email and password are required'
        },
        { status: 400 }
      );
    }

    // Find user by email
    const user = mockUsers.find(u => u.email === email.trim().toLowerCase());
    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Invalid email or password'
        },
        { status: 401 }
      );
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Invalid email or password'
        },
        { status: 401 }
      );
    }

    // Generate mock JWT token
    const token = `jwt_${user._id}_${Date.now()}`;

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json<ApiResponse<AuthResponse>>(
      {
        success: true,
        data: {
          token,
          user: userWithoutPassword
        },
        message: 'Login successful'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}