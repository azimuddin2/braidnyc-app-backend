import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email address'),

    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(8, 'Password must be at least 8 characters')
      .max(20, 'Password cannot exceed 20 characters'),
  }),
});

export const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
});

export const changePasswordValidationSchema = z.object({
  body: z
    .object({
      oldPassword: z.string({
        required_error: 'Old password is required',
      }),

      newPassword: z
        .string({
          required_error: 'New password is required',
        })
        .min(8, 'New password must be at least 8 characters'),

      confirmPassword: z.string({
        required_error: 'Confirm password is required',
      }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'NewPassword & ConfirmPassword do not match',
      path: ['confirmPassword'],
    }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email address'),
  }),
});

export const resetPasswordValidationSchema = z.object({
  body: z
    .object({
      newPassword: z
        .string({
          required_error: 'New password is required',
        })
        .min(8, 'New password must be at least 8 characters'),

      confirmPassword: z.string({
        required_error: 'Confirm password is required',
      }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'NewPassword & ConfirmPassword do not match',
      path: ['confirmPassword'],
    }),
});

export const AuthValidations = {
  loginValidationSchema,
  refreshTokenValidationSchema,
  changePasswordValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};
