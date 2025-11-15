import { z } from 'zod';
import { OnServiceStatus } from './onService.constant';

const createOnServiceValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    price: z.number({ required_error: 'Price is required' }),
    about: z.string({ required_error: 'About is required' }),
  }),
});

const updateOnServiceValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).optional(),
    price: z.number({ required_error: 'Price is required' }).optional(),
    about: z.string({ required_error: 'About is required' }).optional(),
  }),
});

const updateOnServiceStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...OnServiceStatus] as [string, ...string[]]),
  }),
});

export const OnServiceValidations = {
  createOnServiceValidationSchema,
  updateOnServiceValidationSchema,
  updateOnServiceStatusValidationSchema,
};
