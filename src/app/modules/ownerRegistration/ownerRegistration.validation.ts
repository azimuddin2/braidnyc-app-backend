import { z } from 'zod';

// Opening hour validation
const OpeningHourZodSchema = z.object({
  enabled: z.boolean().default(true),
  day: z.string({ required_error: 'Day is required' }),
  openTime: z
    .string({ required_error: 'Open time is required' })
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      'Invalid open time format (HH:mm)',
    ),
  closeTime: z
    .string({ required_error: 'Close time is required' })
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      'Invalid close time format (HH:mm)',
    ),
});

// ✅ Location nested schema
const LocationZodSchema = z.object({
  streetAddress: z.string().optional(),
  coordinates: z
    .object({
      lat: z
        .number({
          required_error: 'Latitude is required',
          invalid_type_error: 'Latitude must be a number',
        })
        .refine(
          (val) => val >= -90 && val <= 90,
          'Latitude must be between -90 and 90',
        )
        .optional(),
      lng: z
        .number({
          required_error: 'Longitude is required',
          invalid_type_error: 'Longitude must be a number',
        })
        .refine(
          (val) => val >= -180 && val <= 180,
          'Longitude must be between -180 and 180',
        )
        .optional(),
    })
    .optional(),
});

// ✅ Main validation schema
const createOwnerRegistrationZodSchema = z.object({
  body: z.object({
    salonName: z.string({ required_error: 'Salon name is required' }),
    about: z.string({ required_error: 'About section is required' }),
    openingHours: z
      .array(OpeningHourZodSchema)
      .nonempty('At least one opening hour is required'),
  }),
});

const updateOwnerRegistrationZodSchema = z.object({
  body: z.object({
    salonName: z.string({ required_error: 'Salon name is required' }),
    about: z.string({ required_error: 'About section is required' }),
    openingHours: z
      .array(OpeningHourZodSchema)
      .nonempty('At least one opening hour is required'),

    businessRegistrationNumber: z.number({
      required_error: 'Business Registration Number is required',
    }),

    // ✅ Nested location validation
    location: LocationZodSchema.optional(),
  }),
});

export const OwnerRegistrationValidation = {
  createOwnerRegistrationZodSchema,
  updateOwnerRegistrationZodSchema,
};
