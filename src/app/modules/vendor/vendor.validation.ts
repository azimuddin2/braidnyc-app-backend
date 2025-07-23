import z from 'zod';

const vendorRegisterUserValidationSchema = z.object({
  body: z
    .object({
      businessName: z.string({
        required_error: 'Business name is required',
        invalid_type_error: 'Business name must be a string',
      }),

      email: z
        .string({
          required_error: 'Email is required',
        })
        .email('Invalid email address'),

      phone: z
        .string({
          required_error: 'Phone number is required',
        })
        .min(7, 'Phone number seems too short'),

      country: z.string({
        required_error: 'Country is required',
      }),

      street: z.string({
        required_error: 'Street address is required',
      }),

      state: z.string({
        required_error: 'State is required',
      }),

      zipCode: z.string({
        required_error: 'Zip code is required',
      }),

      currency: z.string({
        required_error: 'Currency is required',
      }),

      timeZone: z.string({
        required_error: 'Time zone is required',
      }),

      workHours: z.string({
        required_error: 'Work hours are required',
      }),

      firstName: z.string({
        required_error: 'First name is required',
      }),

      lastName: z.string({
        required_error: 'Last name is required',
      }),

      password: z
        .string({
          required_error: 'Password is required',
        })
        .min(8, 'Password must be at least 8 characters')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(
          /[!@#$%^&*]/,
          'Password must contain at least one special character',
        ),

      confirmPassword: z
        .string({
          required_error: 'Confirm password is required',
        })
        .min(8, 'Confirm password must be at least 8 characters'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Password & ConfirmPassword do not match',
      path: ['confirmPassword'],
    }),
});

export const VendorValidations = {
  vendorRegisterUserValidationSchema,
};
