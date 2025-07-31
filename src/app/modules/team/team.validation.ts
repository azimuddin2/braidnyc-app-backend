import { z } from 'zod';

const createTeamMemberValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),

    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email address'),

    role: z.string({
      required_error: 'Role is required',
    }),

    speciality: z.string({
      required_error: 'Speciality is required',
    }),

    timeZone: z.string({
      required_error: 'Time zone is required',
    }),

    workHours: z.string({
      required_error: 'Work hours are required',
    }),

    assignTask: z.array(z.string(), {
      required_error: 'At least one task is required',
    }),

    phone: z
      .string({
        required_error: 'Phone number is required',
      })
      .regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),
  }),
});

const updateTeamMemberValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
      })
      .optional(),

    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email address')
      .optional(),

    role: z
      .string({
        required_error: 'Role is required',
      })
      .optional(),

    speciality: z
      .string({
        required_error: 'Speciality is required',
      })
      .optional(),

    timeZone: z
      .string({
        required_error: 'Time zone is required',
      })
      .optional(),

    workHours: z
      .string({
        required_error: 'Work hours are required',
      })
      .optional(),

    assignTask: z
      .array(z.string(), {
        required_error: 'At least one task is required',
      })
      .optional(),

    phone: z
      .string({
        required_error: 'Phone number is required',
      })
      .regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number')
      .optional(),
  }),
});

export const TeamValidations = {
  createTeamMemberValidationSchema,
  updateTeamMemberValidationSchema,
};
