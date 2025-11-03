import { z } from 'zod';

const createSpecialistValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
  }),
});

const updateSpecialistValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
      })
      .optional(),
  }),
});

export const SpecialistValidations = {
  createSpecialistValidationSchema,
  updateSpecialistValidationSchema,
};
