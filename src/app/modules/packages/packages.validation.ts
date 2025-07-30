import { z } from 'zod';

const imageSchema = z.object({
  url: z
    .string({ required_error: 'Image URL is required' })
    .url({ message: 'Invalid image URL' }),
  key: z.string({ required_error: 'Image key is required' }),
});

const timeSlotSchema = z.object({
  date: z.string({ required_error: 'Date is required' }),
  day: z.string({ required_error: 'Day is required' }),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  seatCapacity: z.number().optional(),
  isClosed: z.boolean().optional(),
});

const holidaySlotSchema = z.object({
  date: z.string({ required_error: 'Holiday date is required' }),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  seatCapacity: z.number().optional(),
  isClosed: z.boolean().optional(),
});

const createPackagesValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Service name is required' }),
    serviceType: z.string({ required_error: 'Service type is required' }),
    duration: z.string({ required_error: 'Duration is required' }),
    price: z.number({ required_error: 'Price is required' }),
    discountPrice: z.number().optional(),
    status: z.enum(['available', 'unavailable']).optional(),
    description: z.string().optional(),
    images: z
      .array(imageSchema, { required_error: 'Images are required' })
      .min(1, 'At least one image is required'),

    weeklySchedule: z
      .array(timeSlotSchema, { required_error: 'Weekly schedule is required' })
      .min(1, 'At least one schedule is required'),

    holidaySlots: z.array(holidaySlotSchema).optional(),
  }),
});

const updatePackagesValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Service name is required' }).optional(),
    serviceType: z
      .string({ required_error: 'Service type is required' })
      .optional(),
    duration: z.string({ required_error: 'Duration is required' }).optional(),
    price: z.number({ required_error: 'Price is required' }).optional(),
    discountPrice: z.number().optional(),
    status: z.enum(['available', 'unavailable']).optional(),
    description: z.string().optional(),

    weeklySchedule: z
      .array(timeSlotSchema, { required_error: 'Weekly schedule is required' })
      .min(1, 'At least one schedule is required')
      .optional(),

    holidaySlots: z.array(holidaySlotSchema).optional(),
  }),
});

export const PackagesValidations = {
  createPackagesValidationSchema,
  updatePackagesValidationSchema,
};
