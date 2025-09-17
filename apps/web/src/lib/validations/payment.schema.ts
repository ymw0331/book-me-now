import { z } from 'zod';

// Stripe checkout session schema
export const createCheckoutSessionSchema = z.object({
  hotelId: z.string().min(1, 'Hotel ID is required'),
  bookingData: z.object({
    checkIn: z.string().min(1, 'Check-in date is required'),
    checkOut: z.string().min(1, 'Check-out date is required'),
    guests: z.number().min(1, 'At least 1 guest is required'),
  }),
  amount: z.number().min(1, 'Amount must be at least $1'),
  currency: z.string().default('usd'),
  successUrl: z.string().url('Invalid success URL').optional(),
  cancelUrl: z.string().url('Invalid cancel URL').optional(),
});

export type CreateCheckoutSessionFormData = z.infer<typeof createCheckoutSessionSchema>;

// Payment intent schema
export const createPaymentIntentSchema = z.object({
  amount: z
    .number()
    .min(50, 'Amount must be at least $0.50')
    .max(999999, 'Amount must be less than $999,999'),
  currency: z.string().default('usd'),
  paymentMethodId: z.string().optional(),
  savePaymentMethod: z.boolean().optional(),
  metadata: z.record(z.string()).optional(),
});

export type CreatePaymentIntentFormData = z.infer<typeof createPaymentIntentSchema>;

// Card payment schema
export const cardPaymentSchema = z.object({
  cardNumber: z
    .string()
    .min(1, 'Card number is required')
    .regex(/^\d{13,19}$/, 'Invalid card number'),
  cardholderName: z
    .string()
    .min(1, 'Cardholder name is required')
    .min(3, 'Name must be at least 3 characters'),
  expiryMonth: z
    .string()
    .regex(/^(0[1-9]|1[0-2])$/, 'Invalid month (MM)'),
  expiryYear: z
    .string()
    .regex(/^\d{2}$/, 'Invalid year (YY)'),
  cvv: z
    .string()
    .regex(/^\d{3,4}$/, 'Invalid CVV'),
  saveCard: z.boolean().optional(),
});

export type CardPaymentFormData = z.infer<typeof cardPaymentSchema>;

// Billing address schema
export const billingAddressSchema = z.object({
  line1: z
    .string()
    .min(1, 'Address line 1 is required'),
  line2: z.string().optional(),
  city: z
    .string()
    .min(1, 'City is required'),
  state: z.string().optional(),
  postalCode: z
    .string()
    .min(1, 'Postal code is required'),
  country: z
    .string()
    .min(2, 'Country code must be 2 characters')
    .max(2, 'Country code must be 2 characters'),
});

export type BillingAddressFormData = z.infer<typeof billingAddressSchema>;

// Refund schema
export const refundPaymentSchema = z.object({
  paymentIntentId: z
    .string()
    .min(1, 'Payment intent ID is required'),
  amount: z
    .number()
    .min(1, 'Refund amount must be at least $1')
    .optional(),
  reason: z
    .enum(['duplicate', 'fraudulent', 'requested_by_customer', 'other'])
    .default('requested_by_customer'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
});

export type RefundPaymentFormData = z.infer<typeof refundPaymentSchema>;

// Payout schema
export const createPayoutSchema = z.object({
  amount: z
    .number()
    .min(1, 'Payout amount must be at least $1'),
  currency: z.string().default('usd'),
  destination: z
    .enum(['bank_account', 'debit_card'])
    .default('bank_account'),
  description: z
    .string()
    .max(200, 'Description must be less than 200 characters')
    .optional(),
  statementDescriptor: z
    .string()
    .max(22, 'Statement descriptor must be less than 22 characters')
    .optional(),
});

export type CreatePayoutFormData = z.infer<typeof createPayoutSchema>;

// Connect account schema
export const connectAccountSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  country: z
    .string()
    .min(2, 'Country code must be 2 characters')
    .max(2, 'Country code must be 2 characters'),
  type: z
    .enum(['individual', 'company'])
    .default('individual'),
  businessType: z
    .enum(['individual', 'company', 'non_profit', 'government_entity'])
    .optional(),
  businessName: z
    .string()
    .min(1, 'Business name is required when type is company')
    .optional(),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, 'You must accept Stripe Connect terms'),
}).refine((data) => {
  if (data.type === 'company' && !data.businessName) {
    return false;
  }
  return true;
}, {
  message: 'Business name is required for company accounts',
  path: ['businessName'],
});

export type ConnectAccountFormData = z.infer<typeof connectAccountSchema>;

// Payment method schema
export const paymentMethodSchema = z.object({
  type: z.enum(['card', 'bank_account', 'paypal']),
  card: cardPaymentSchema.optional(),
  bankAccount: z.object({
    accountNumber: z.string().min(1, 'Account number is required'),
    routingNumber: z.string().min(1, 'Routing number is required'),
    accountHolderName: z.string().min(1, 'Account holder name is required'),
    accountHolderType: z.enum(['individual', 'company']),
  }).optional(),
  paypal: z.object({
    email: z.string().email('Invalid PayPal email'),
  }).optional(),
  setAsDefault: z.boolean().optional(),
});

export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;