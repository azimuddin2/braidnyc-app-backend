import { z } from 'zod';
import { ServiceStatus } from './ownerService.constant';

// ---------- Main Create Validation ----------
const createOwnerServiceValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    category: z.string({ required_error: 'Category is required' }),
    subcategory: z.string({ required_error: 'Subcategory is required' }),
    time: z.string({ required_error: 'Time is required' }),
    price: z.number({ required_error: 'Price is required' }),
    status: z
      .enum([...ServiceStatus] as [string, ...string[]])
      .default('available'),
    about: z.string({ required_error: 'About is required' }),
    isDeleted: z.boolean().default(false),
  }),
});

// ---------- Update Validation (all optional) ----------
const updateOwnerServiceValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).optional(),
    category: z.string({ required_error: 'Category is required' }).optional(),
    subcategory: z
      .string({ required_error: 'Subcategory is required' })
      .optional(),
    time: z.string({ required_error: 'Time is required' }).optional(),
    price: z.number({ required_error: 'Price is required' }).optional(),
    status: z
      .enum([...ServiceStatus] as [string, ...string[]])
      .default('available')
      .optional(),
    about: z.string({ required_error: 'About is required' }).optional(),
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
