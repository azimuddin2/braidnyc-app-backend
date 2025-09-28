import { z } from 'zod';

const createPolicyValidationSchema = z.object({
  body: z.object({
    description: z.string({
      required_error: 'Policy Description is required',
    }),
  }),
});

const updatePolicyValidationSchema = z.object({
  body: z.object({
    description: z
      .string({
        required_error: 'Policy Description is required',
      })
      .optional(),
  }),
});

export const PolicyValidation = {
  createPolicyValidationSchema,
  updatePolicyValidationSchema,
};
