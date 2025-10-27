import { z } from 'zod';
import { Availability } from './freelancerRegistration.constant';

// Opening hour validation
const OpeningHourZodSchema = z.object({
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

// ✅ Main validation schema
const createFreelancerRegistrationZodSchema = z.object({
  body: z.object({
    experienceYear: z.number({ required_error: 'Experience year is required' }),
    about: z.string({ required_error: 'About section is required' }),
    openingHours: z
      .array(OpeningHourZodSchema)
      .nonempty('At least one opening hour is required'),

    availability: z.enum([...Availability] as [string, ...string[]], {
      required_error: 'Availability is required',
    }),
  }),
});

export const FreelancerRegistrationValidation = {
  createFreelancerRegistrationZodSchema,
};
