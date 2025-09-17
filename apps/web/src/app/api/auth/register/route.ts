import { NextRequest, NextResponse } from 'next/server';
import { RegisterRequest, ApiResponse, AuthResponse } from '@/types/api';
import bcrypt from 'bcryptjs';

// Mock user database - in production, replace with actual database
const mockUsers: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();
    const { name, email, password } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Name, email, and password are required'
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Password must be at least 6 characters long'
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = mockUsers.find(user => user.email === email);
    if (existingUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'User with this email already exists'
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = {
      _id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      stripe_account_id: '',
      stripe_seller: {},
      stripeSession: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save user to mock database
    mockUsers.push(newUser);

    // Generate mock JWT token
    const token = `jwt_${newUser._id}_${Date.now()}`;

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json<ApiResponse<AuthResponse>>(
      {
        success: true,
        data: {
          token,
          user: userWithoutPassword
        },
        message: 'User registered successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}