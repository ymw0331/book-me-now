import { z } from 'zod';

// Booking creation schema
export const createBookingSchema = z.object({
  propertyId: z
    .string()
    .min(1, 'Property ID is required'),
  checkIn: z
    .string()
    .min(1, 'Check-in date is required'),
  checkOut: z
    .string()
    .min(1, 'Check-out date is required'),
  guests: z
    .number()
    .min(1, 'At least 1 guest is required')
    .max(50, 'Maximum 50 guests allowed'),
  adults: z
    .number()
    .min(1, 'At least 1 adult is required')
    .optional(),
  children: z
    .number()
    .min(0)
    .optional(),
  infants: z
    .number()
    .min(0)
    .optional(),
  specialRequests: z
    .string()
    .max(500, 'Special requests must be less than 500 characters')
    .optional(),
  totalAmount: z
    .number()
    .min(1, 'Total amount must be at least $1'),
  paymentMethod: z
    .enum(['card', 'paypal', 'bank_transfer', 'cash'])
    .default('card'),
}).refine((data) => new Date(data.checkIn) < new Date(data.checkOut), {
  message: 'Check-out date must be after check-in date',
  path: ['checkOut'],
}).refine((data) => {
  const adults = data.adults || 0;
  const children = data.children || 0;
  const infants = data.infants || 0;
  return adults + children + infants === data.guests;
}, {
  message: 'Guest breakdown must equal total guests',
  path: ['guests'],
});

export type CreateBookingFormData = z.infer<typeof createBookingSchema>;

// Booking update schema
export const updateBookingSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  guests: z.number().min(1).max(50).optional(),
  specialRequests: z.string().max(500).optional(),
  status: z
    .enum(['pending', 'confirmed', 'cancelled', 'completed'])
    .optional(),
});

export type UpdateBookingFormData = z.infer<typeof updateBookingSchema>;

// Cancel booking schema
export const cancelBookingSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  reason: z
    .enum([
      'change_of_plans',
      'found_better_option',
      'personal_emergency',
      'property_issue',
      'other'
    ])
    .default('change_of_plans'),
  comments: z
    .string()
    .max(500, 'Comments must be less than 500 characters')
    .optional(),
});

export type CancelBookingFormData = z.infer<typeof cancelBookingSchema>;

// Booking search schema
export const searchBookingSchema = z.object({
  status: z
    .enum(['all', 'pending', 'confirmed', 'cancelled', 'completed'])
    .optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  propertyId: z.string().optional(),
  userId: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sortBy: z
    .enum(['date', 'amount', 'status'])
    .optional(),
  sortOrder: z
    .enum(['asc', 'desc'])
    .optional(),
});

export type SearchBookingFormData = z.infer<typeof searchBookingSchema>;

// Guest details schema
export const guestDetailsSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  country: z
    .string()
    .min(1, 'Country is required'),
  address: z
    .string()
    .max(200, 'Address must be less than 200 characters')
    .optional(),
  city: z
    .string()
    .max(100, 'City must be less than 100 characters')
    .optional(),
  postalCode: z
    .string()
    .max(20, 'Postal code must be less than 20 characters')
    .optional(),
  arrivalTime: z
    .string()
    .optional(),
  dietaryRestrictions: z
    .string()
    .max(200, 'Dietary restrictions must be less than 200 characters')
    .optional(),
});

export type GuestDetailsFormData = z.infer<typeof guestDetailsSchema>;

// Booking confirmation schema
export const bookingConfirmationSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  confirmationCode: z
    .string()
    .min(6, 'Confirmation code must be at least 6 characters'),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, 'You must accept the terms and conditions'),
  acceptCancellationPolicy: z
    .boolean()
    .refine((val) => val === true, 'You must accept the cancellation policy'),
});

export type BookingConfirmationFormData = z.infer<typeof bookingConfirmationSchema>;