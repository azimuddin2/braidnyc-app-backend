import { z } from 'zod';

const createTermsValidationSchema = z.object({
  body: z.object({
    description: z.string({
      required_error: 'Terms Description is required',
    }),
  }),
});

const updateTermsValidationSchema = z.object({
  body: z.object({
    description: z
      .string({
        required_error: 'Terms Description is required',
      })
      .optional(),
  }),
});

export const TermsValidation = {
  createTermsValidationSchema,
  updateTermsValidationSchema,
};
