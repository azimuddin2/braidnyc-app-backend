import { z } from 'zod';

const createBookingValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Full name is required' })
      .min(3, 'Full name must be at least 3 characters'),

    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address'),

    phone: z
      .string({ required_error: 'Phone number is required' })
      .min(1, 'Phone number is required')
      .regex(/^\+?\d+$/, 'Phone number must contain only digits'),

    serviceName: z
      .string({ required_error: 'Service name is required' })
      .min(1, 'Service name is required'),

    duration: z
      .string({ required_error: 'Duration is required' })
      .min(1, 'Duration is required'),

    price: z
      .number({ required_error: 'Price is required' })
      .positive('Price must be a positive number')
      .refine((val) => Number(val.toFixed(2)) === val, {
        message: 'Price can have at most 2 decimal places',
      }),

    date: z
      .string({ required_error: 'Date is required' })
      .min(1, 'Date is required'),

    time: z
      .string({ required_error: 'Time is required' })
      .min(1, 'Time is required'),
  }),
});

export const BookingValidation = {
  createBookingValidationSchema,
};
