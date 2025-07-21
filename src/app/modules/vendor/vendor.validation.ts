import z from 'zod';
import { AccountType } from '../user/user.constant';

const vendorRegisterUserValidationSchema = z.object({
  body: z.object({
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

    accountType: z
      .enum([...AccountType] as [string, ...string[]])
      .default('service provider'),
  }),
});

export const VendorValidations = {
  vendorRegisterUserValidationSchema,
};
