import { z } from 'zod';

const createPrivacyValidationSchema = z.object({
  body: z.object({
    description: z.string({
      required_error: 'Privacy Description is required',
    }),
  }),
});

const updatePrivacyValidationSchema = z.object({
  body: z.object({
    description: z
      .string({
        required_error: 'Privacy Description is required',
      })
      .optional(),
  }),
});

export const PrivacyValidation = {
  createPrivacyValidationSchema,
  updatePrivacyValidationSchema,
};
