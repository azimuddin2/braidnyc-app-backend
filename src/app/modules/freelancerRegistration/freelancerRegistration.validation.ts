import { z } from 'zod';

// Opening hour validation
const OpeningHourZodSchema = z.object({
  enabled: z.boolean().default(true),
  day: z.string({ required_error: 'Day is required' }),
  openTime: z.string({ required_error: 'Open time is required' }),
  closeTime: z.string({ required_error: 'Close time is required' }),
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
const createFreelancerRegistrationZodSchema = z.object({
  body: z.object({
    experienceYear: z.number({ required_error: 'Experience year is required' }),
    about: z.string({ required_error: 'About section is required' }),
    openingHours: z
      .array(OpeningHourZodSchema)
      .nonempty('At least one opening hour is required'),

    availability: z.array(z.string(), {
      required_error: 'At least one availability is required',
    }),
  }),
});

const updateFreelancerRegistrationZodSchema = z.object({
  body: z.object({
    experienceYear: z
      .number({ required_error: 'Experience year is required' })
      .optional(),
    about: z.string({ required_error: 'About section is required' }),
    openingHours: z
      .array(OpeningHourZodSchema)
      .nonempty('At least one opening hour is required'),

    availability: z
      .array(z.string(), {
        required_error: 'At least one availability is required',
      })
      .optional(),

    name: z.string({ required_error: 'Name is required' }),
    businessRegistrationNumber: z.number({
      required_error: 'Business registration number is required',
    }),
    city: z.string({ required_error: 'City is required' }),
    postalCode: z.number({ required_error: 'Postal code is required' }),
    country: z.string({ required_error: 'Country is required' }),

    // ✅ Nested location validation
    location: LocationZodSchema.optional(),
  }),
});

export const FreelancerRegistrationValidation = {
  createFreelancerRegistrationZodSchema,
  updateFreelancerRegistrationZodSchema,
};
