import { NextRequest } from 'next/server';

// Mock token blacklist - in production, use Redis or database
export const blacklistedTokens = new Set<string>();

// Helper function to extract user ID from mock JWT token
export function getUserIdFromToken(token: string): string | null {
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
export function isTokenExpired(token: string): boolean {
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

// Extract and validate token from request
export function extractAndValidateToken(request: NextRequest): {
  isValid: boolean;
  userId: string | null;
  error?: string;
} {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return {
      isValid: false,
      userId: null,
      error: 'Authorization token required'
    };
  }

  // Check if token is blacklisted
  if (blacklistedTokens.has(token)) {
    return {
      isValid: false,
      userId: null,
      error: 'Token has been revoked'
    };
  }

  // Check if token is expired
  if (isTokenExpired(token)) {
    return {
      isValid: false,
      userId: null,
      error: 'Token has expired'
    };
  }

  // Extract user ID from token
  const userId = getUserIdFromToken(token);
  if (!userId) {
    return {
      isValid: false,
      userId: null,
      error: 'Invalid token format'
    };
  }

  return {
    isValid: true,
    userId
  };
}

// Mock data that should be shared across routes
export const mockUsers = [
  {
    _id: 'user_demo_123',
    name: 'Demo User',
    email: 'demo@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewFyLmEbT9bJ5x.G', // password: 'demo123'
    stripe_account_id: 'acct_1MockStripeAccount123',
    stripe_seller: {
      id: 'acct_1MockStripeAccount123',
      charges_enabled: true,
      details_submitted: true,
      payouts_enabled: true
    },
    stripeSession: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockProperties = [
  {
    _id: 'property_1',
    title: 'Luxury Beach Resort',
    content: 'Beautiful beachfront property with stunning ocean views, private beach access, and world-class amenities.',
    location: 'Malibu, California',
    price: 450,
    postedBy: 'user_demo_123',
    from: '2024-01-01',
    to: '2024-12-31',
    bed: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'property_2',
    title: 'Downtown City Apartment',
    content: 'Modern apartment in the heart of downtown with easy access to restaurants, shopping, and entertainment.',
    location: 'New York, NY',
    price: 280,
    postedBy: 'user_demo_123',
    from: '2024-01-01',
    to: '2024-12-31',
    bed: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'property_3',
    title: 'Mountain Cabin Retreat',
    content: 'Cozy cabin nestled in the mountains, perfect for a peaceful getaway with hiking trails nearby.',
    location: 'Aspen, Colorado',
    price: 320,
    postedBy: 'user_demo_123',
    from: '2024-01-01',
    to: '2024-12-31',
    bed: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'property_4',
    title: 'Urban Loft Space',
    content: 'Stylish loft in trendy neighborhood with exposed brick walls and modern amenities.',
    location: 'San Francisco, CA',
    price: 380,
    postedBy: 'user_demo_123',
    from: '2024-01-01',
    to: '2024-12-31',
    bed: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'property_5',
    title: 'Lakeside Villa',
    content: 'Spacious villa overlooking a serene lake with private dock and outdoor activities.',
    location: 'Lake Tahoe, Nevada',
    price: 520,
    postedBy: 'user_demo_123',
    from: '2024-01-01',
    to: '2024-12-31',
    bed: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockOrders = [
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