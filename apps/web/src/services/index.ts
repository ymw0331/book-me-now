// Export all services for easy importing
export * from './api.service';
export * from './auth.service';
export * from './properties.service';
export * from './orders.service';
export * from './stripe.service';

// Export service instances
export {
  apiService as default,
  authService,
  propertiesService,
  ordersService,
  stripeService,
} from './api.service';