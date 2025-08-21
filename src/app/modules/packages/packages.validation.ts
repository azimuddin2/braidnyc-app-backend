import { z } from 'zod';
import { HighlightStatus, ServiceStatus } from './packages.constant';

// ---------- Sub Schemas ----------
const ServicePricingSchema = z.object({
  id: z.string({ required_error: 'Service ID is required' }),
  duration: z.string({ required_error: 'Duration is required' }),
  price: z.string({ required_error: 'Price is required' }),
  discount: z.string().optional(),
  finalPrice: z.string({ required_error: 'Final price is required' }),
});

const DayScheduleSchema = z.object({
  enabled: z.boolean().default(false),
  startTime: z.string({ required_error: 'Start time is required' }), // e.g. "09:00"
  endTime: z.string({ required_error: 'End time is required' }), // e.g. "17:00"
  seats: z.number().min(1, 'Seats must be at least 1').default(1),
});

const HolidayScheduleSchema = z.object({
  date: z
    .string({ required_error: 'Date is required' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  startTime: z.string({ required_error: 'Start time is required' }),
  endTime: z.string({ required_error: 'End time is required' }),
  seats: z.number().min(1, 'Seats must be at least 1'),
});

// ---------- Main Create Validation ----------
export const createPackagesValidationSchema = z.object({
  body: z.object({
    user: z.string({ required_error: 'User ID is required' }), // ObjectId (string)
    name: z.string({ required_error: 'Name is required' }),
    type: z.string({ required_error: 'Type is required' }),
    savedServices: z
      .array(ServicePricingSchema, {
        required_error: 'At least one service is required',
      })
      .nonempty(),
    description: z.string().optional(),
    status: z
      .enum([...ServiceStatus] as [string, ...string[]])
      .default('available'),
    highlightStatus: z
      .enum(HighlightStatus as [string, ...string[]])
      .default('Highlight'),
    availability: z.object({
      weeklySchedule: z.record(DayScheduleSchema).default({}),
      holidays: z.array(HolidayScheduleSchema).default([]),
    }),
    isDeleted: z.boolean().default(false),
  }),
});

// ---------- Update Validation (all optional) ----------
export const updatePackagesValidationSchema = z.object({
  body: z.object({
    user: z.string().optional(),
    deleteKey: z.array(z.string()).optional(),
    name: z.string().optional(),
    type: z.string().optional(),
    savedServices: z.array(ServicePricingSchema).optional(),
    description: z.string().optional(),
    status: z.enum([...ServiceStatus] as [string, ...string[]]).optional(),
    highlightStatus: z
      .enum(HighlightStatus as [string, ...string[]])
      .optional(),
    availability: z
      .object({
        weeklySchedule: z.record(DayScheduleSchema).optional(),
        holidays: z.array(HolidayScheduleSchema).optional(),
      })
      .optional(),
    isDeleted: z.boolean().optional(),
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
