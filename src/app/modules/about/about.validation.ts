import { z } from 'zod';

const createAboutValidationSchema = z.object({
  body: z.object({
    description: z.string({
      required_error: 'About Description is required',
    }),
  }),
});

const updateAboutValidationSchema = z.object({
  body: z.object({
    description: z
      .string({
        required_error: 'About Description is required',
      })
      .optional(),
  }),
});

export const AboutValidation = {
  createAboutValidationSchema,
  updateAboutValidationSchema,
};
