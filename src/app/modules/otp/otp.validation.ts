import { z } from 'zod';

const verifyOtpValidationSchema = z.object({
  body: z.object({
    otp: z
      .string({
        required_error: 'OTP is required',
      })
      .min(4, 'OTP must be at least 4 digits')
      .regex(/^\d+$/, 'OTP must contain only numbers'),
  }),
});

export const OtpValidations = {
  verifyOtpValidationSchema,
};
