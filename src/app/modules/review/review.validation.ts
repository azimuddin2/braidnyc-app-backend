import { z } from 'zod';
import { Types } from 'mongoose';

// Custom ObjectId validator
const objectId = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: 'Invalid MongoDB ObjectId',
  })
  .transform((val) => new Types.ObjectId(val));

export const createReviewValidationSchema = z.object({
  body: z
    .object({
      freelancer: objectId.optional(), // target freelancer
      owner: objectId.optional(), // target owner
      comment: z
        .string({ required_error: 'Comment is required' })
        .min(12, 'Comment must be at least 12 characters long'),
      rating: z
        .number({ required_error: 'Rating is required' })
        .min(1, 'Rating must be at least 1')
        .max(5, 'Rating must be at most 5'),
    })
    .refine((data) => data.freelancer || data.owner, {
      message: 'Either freelancer or owner must be provided',
      path: ['freelancer'],
    })
    .refine((data) => !(data.freelancer && data.owner), {
      message: 'Provide either freelancer or owner, not both',
      path: ['owner'],
    }),
});

export const ReviewValidation = {
  createReviewValidationSchema,
};
