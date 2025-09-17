import { z } from 'zod';

// Property creation schema
export const createPropertySchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters'),
  content: z
    .string()
    .min(1, 'Description is required')
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  location: z
    .string()
    .min(1, 'Location is required')
    .min(3, 'Location must be at least 3 characters'),
  price: z
    .number()
    .min(1, 'Price must be at least $1')
    .max(10000, 'Price must be less than $10,000 per night'),
  image: z
    .string()
    .url('Invalid image URL')
    .or(z.string().startsWith('data:image/', 'Invalid image format')),
  from: z
    .string()
    .min(1, 'Available from date is required'),
  to: z
    .string()
    .min(1, 'Available to date is required'),
  bed: z
    .number()
    .min(1, 'At least 1 bedroom is required')
    .max(20, 'Maximum 20 bedrooms allowed'),
  amenities: z
    .array(z.string())
    .optional(),
  propertyType: z
    .enum(['apartment', 'house', 'villa', 'hotel', 'resort', 'other'])
    .default('apartment'),
  maxGuests: z
    .number()
    .min(1, 'At least 1 guest is required')
    .max(50, 'Maximum 50 guests allowed')
    .optional(),
}).refine((data) => new Date(data.from) < new Date(data.to), {
  message: 'End date must be after start date',
  path: ['to'],
});

export type CreatePropertyFormData = z.infer<typeof createPropertySchema>;

// Property update schema (all fields optional except id)
export const updatePropertySchema = createPropertySchema.partial().extend({
  id: z.string().min(1, 'Property ID is required'),
});

export type UpdatePropertyFormData = z.infer<typeof updatePropertySchema>;

// Property search schema
export const searchPropertySchema = z.object({
  location: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  bed: z.number().min(0).optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  propertyType: z
    .enum(['apartment', 'house', 'villa', 'hotel', 'resort', 'other'])
    .optional(),
  amenities: z.array(z.string()).optional(),
  sortBy: z
    .enum(['price', 'rating', 'date', 'popularity'])
    .optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
}).refine((data) => {
  if (data.priceMin && data.priceMax) {
    return data.priceMin <= data.priceMax;
  }
  return true;
}, {
  message: 'Minimum price must be less than maximum price',
  path: ['priceMax'],
}).refine((data) => {
  if (data.from && data.to) {
    return new Date(data.from) < new Date(data.to);
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['to'],
});

export type SearchPropertyFormData = z.infer<typeof searchPropertySchema>;

// Property filters schema
export const propertyFiltersSchema = z.object({
  priceRange: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }).optional(),
  bedrooms: z.array(z.number()).optional(),
  propertyTypes: z.array(
    z.enum(['apartment', 'house', 'villa', 'hotel', 'resort', 'other'])
  ).optional(),
  amenities: z.array(z.string()).optional(),
  rating: z.number().min(0).max(5).optional(),
  instantBook: z.boolean().optional(),
  superhostOnly: z.boolean().optional(),
});

export type PropertyFiltersFormData = z.infer<typeof propertyFiltersSchema>;

// Property availability schema
export const propertyAvailabilitySchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  dates: z.array(z.object({
    from: z.string(),
    to: z.string(),
    available: z.boolean(),
    price: z.number().optional(),
  })),
});

export type PropertyAvailabilityFormData = z.infer<typeof propertyAvailabilitySchema>;

// Property review schema
export const propertyReviewSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  rating: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  comment: z
    .string()
    .min(10, 'Review must be at least 10 characters')
    .max(500, 'Review must be less than 500 characters'),
  cleanliness: z.number().min(1).max(5).optional(),
  communication: z.number().min(1).max(5).optional(),
  checkIn: z.number().min(1).max(5).optional(),
  accuracy: z.number().min(1).max(5).optional(),
  location: z.number().min(1).max(5).optional(),
  value: z.number().min(1).max(5).optional(),
});

export type PropertyReviewFormData = z.infer<typeof propertyReviewSchema>;