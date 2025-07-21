import { z } from 'zod';
import { AccountType, UserStatus } from './user.constant';

const registerUserValidationSchema = z.object({
  body: z.object({
    firstName: z
      .string({
        required_error: 'First name is required',
        invalid_type_error: 'First name must be a string',
      })
      .min(3, 'First name must be at least 3 characters')
      .max(20, 'First name cannot exceed 20 characters'),

    lastName: z
      .string({
        required_error: 'Last name is required',
        invalid_type_error: 'Last name must be a string',
      })
      .min(3, 'Last name must be at least 3 characters')
      .max(20, 'Last name cannot exceed 20 characters'),

    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email address'),

    phone: z
      .string({
        required_error: 'Phone number is required',
      })
      .regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),

    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(8, 'Password must be at least 8 characters')
      .max(20, 'Password cannot exceed 20 characters'),

    confirmPassword: z
      .string({
        required_error: 'Confirm password is required',
      })
      .min(8, 'Confirm password must be at least 8 characters')
      .max(20, 'Confirm password cannot exceed 20 characters'),

    accountType: z
      .enum([...AccountType] as [string, ...string[]])
      .default('user'),

    image: z.string().optional(),
    location: z.string().optional(),

    status: z.enum([...UserStatus] as [string, ...string[]]).default('ongoing'),

    isDeleted: z.boolean().optional().default(false),
  }),
});

export const UserValidations = {
  registerUserValidationSchema,
};
