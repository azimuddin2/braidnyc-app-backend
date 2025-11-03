import { z } from 'zod';
import { ServiceStatus } from './ownerService.constant';

// ---------- Main Create Validation ----------
const createOwnerServiceValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    time: z.string({ required_error: 'Time is required' }),
    price: z.number({ required_error: 'Price is required' }),
    status: z
      .enum([...ServiceStatus] as [string, ...string[]])
      .default('available'),
    description: z.string({ required_error: 'Description is required' }),
    isDeleted: z.boolean().default(false),
  }),
});

// ---------- Update Validation (all optional) ----------
const updateOwnerServiceValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).optional(),
    time: z.string({ required_error: 'Time is required' }).optional(),
    price: z.number({ required_error: 'Price is required' }).optional(),
    status: z
      .enum([...ServiceStatus] as [string, ...string[]])
      .default('available')
      .optional(),
    description: z
      .string({ required_error: 'Description is required' })
      .optional(),
    isDeleted: z.boolean().default(false).optional(),
  }),
});

const updateOwnerServiceStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...ServiceStatus] as [string, ...string[]]),
  }),
});

export const OwnerServiceValidations = {
  createOwnerServiceValidationSchema,
  updateOwnerServiceValidationSchema,
  updateOwnerServiceStatusValidationSchema,
};
