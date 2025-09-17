import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types/api';

// Mock orders database
const mockOrders: any[] = [];

// Helper function to verify webhook signature (mock implementation)
function verifyWebhookSignature(payload: string, signature: string): boolean {
  // In a real implementation, you would verify the Stripe webhook signature
  // using the Stripe webhook secret and crypto.createHmac
  return signature.startsWith('t=') && signature.includes('v1=');
}

// POST /api/stripe/webhook - Handle Stripe webhooks
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Missing Stripe signature'
        },
        { status: 400 }
      );
    }

    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Invalid webhook signature'
        },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    // Handle different webhook events
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;

        // Create order when payment is successful
        const order = {
          _id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          hotel: session.metadata.hotelId,
          session: {
            id: session.id,
            amount_total: session.amount_total,
            currency: session.currency,
            payment_status: session.payment_status
          },
          orderedBy: session.metadata.userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        mockOrders.push(order);

        console.log('Order created:', order);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.log('Payment failed:', paymentIntent.id);
        break;
      }

      case 'customer.created': {
        const customer = event.data.object;
        console.log('Customer created:', customer.id);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        console.log('Invoice payment succeeded:', invoice.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: `Webhook ${event.type} processed successfully`
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Webhook processing failed'
      },
      { status: 500 }
    );
  }
}

// Export the mock orders for use in other routes
export { mockOrders };