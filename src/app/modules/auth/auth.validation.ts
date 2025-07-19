import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const AuthValidations = {
  loginValidationSchema,
};
