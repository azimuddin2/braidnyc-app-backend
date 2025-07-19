import z from 'zod';
import { AccountType } from '../user/user.constant';

const vendorRegisterUserValidationSchema = z.object({
  body: z.object({
    businessName: z.string().min(1, 'Business name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
    country: z.string().min(1, 'Country is required'),
    street: z.string().min(1, 'Street address is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'Zip code is required'),
    currency: z.string().min(1, 'Currency is required'),
    timeZone: z.string().min(1, 'Time zone is required'),
    workHours: z.string().min(1, 'Work hours are required'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    accountType: z
      .enum([...AccountType] as [string, ...string[]])
      .default('service provider'),
  }),
});

export const VendorValidations = {
  vendorRegisterUserValidationSchema,
};
