import { z } from 'zod';
import { HighlightStatus, ServiceStatus } from './packages.constant';

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
    status: z.enum([...ServiceStatus] as [string, ...string[]]).optional(),
    description: z.string().optional(),

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
    status: z.enum([...ServiceStatus] as [string, ...string[]]).optional(),
    description: z.string().optional(),

    weeklySchedule: z
      .array(timeSlotSchema, { required_error: 'Weekly schedule is required' })
      .min(1, 'At least one schedule is required')
      .optional(),

    holidaySlots: z.array(holidaySlotSchema).optional(),
  }),
});

const updatePackagesStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...ServiceStatus] as [string, ...string[]]),
  }),
});

const updatePackagesHighlightStatusValidationSchema = z.object({
  body: z.object({
    highlightStatus: z.enum([...HighlightStatus] as [string, ...string[]]),
  }),
});

export const PackagesValidations = {
  createPackagesValidationSchema,
  updatePackagesValidationSchema,
  updatePackagesStatusValidationSchema,
  updatePackagesHighlightStatusValidationSchema,
};
