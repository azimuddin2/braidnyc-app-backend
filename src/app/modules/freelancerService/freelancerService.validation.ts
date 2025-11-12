import { z } from 'zod';
import { ServiceStatus } from './freelancerService.constant';

// ---------- Main Create Validation ----------
const createFreelancerServiceValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    time: z.string({ required_error: 'Time is required' }),
    price: z.number({ required_error: 'Price is required' }),
    status: z
      .enum([...ServiceStatus] as [string, ...string[]])
      .default('available'),
    about: z.string({ required_error: 'About is required' }),
  }),
});

// ---------- Update Validation (all optional) ----------
const updateFreelancerServiceValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).optional(),
    time: z.string({ required_error: 'Time is required' }).optional(),
    price: z.number({ required_error: 'Price is required' }).optional(),
    status: z
      .enum([...ServiceStatus] as [string, ...string[]])
      .default('available')
      .optional(),
    about: z.string({ required_error: 'About is required' }).optional(),
  }),
});

export const FreelancerServiceValidations = {
  createFreelancerServiceValidationSchema,
  updateFreelancerServiceValidationSchema,
};
