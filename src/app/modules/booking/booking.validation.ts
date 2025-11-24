import { z } from 'zod';
import { SERVICE_MODEL_TYPE } from './booking.interface';

const createBookingValidationSchema = z.object({
  body: z.object({
    vendor: z.string().min(1, 'Vendor is required'),
    customer: z.string().min(1, 'Customer is required'),

    service: z.string().min(1, 'Service is required'),

    serviceType: z.enum([
      SERVICE_MODEL_TYPE.OwnerService,
      SERVICE_MODEL_TYPE.FreelancerService,
    ]),

    onServices: z.array(z.string()).optional(),

    email: z.string().email('Invalid email format'),

    date: z.string().min(1, 'Date is required'),
    time: z.string().min(1, 'Time is required'),
    duration: z.string().min(1, 'Duration is required'),

    specialist: z.string().optional(),

    serviceLocation: z.string().min(1, 'Service location is required'),

    image: z.string().nullable().optional(),

    notes: z.string().min(1, 'Notes is required'),

    totalPrice: z.number().min(0, 'Total price must be a positive number'),

    isDeleted: z.boolean().optional(),
  }),
});

export const BookingValidation = {
  createBookingValidationSchema,
};
