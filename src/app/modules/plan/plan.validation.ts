import { z } from 'zod';

const createPlanValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Plan Name is required' })
      .min(3, 'Plan name must be at least 3 characters'),
    cost: z
      .number({ required_error: 'Cost is required' })
      .min(0, 'Cost cannot be negative'),
    description: z
      .string({ required_error: 'Plan description is required' })
      .min(10, 'Description must be at least 10 characters'),

    features: z.object({
      teamMembers: z.boolean().default(false),
      sharedCalendar: z.boolean().default(false),
      taskHub: z.boolean().default(false),
      grantPermissionAccess: z.boolean().default(false),
    }),

    limits: z.object({
      serviceMax: z.number().min(0).default(0),
      productMax: z.number().min(0).default(0),
      highlightOfferMax: z.number().min(0).default(0),
      transactionFee: z.number().min(0).max(100).default(0),
    }),

    validity: z.object({
      type: z.enum(['unlimited', 'fixed']),
      durationInMonths: z.string().nullable().optional(),
    }),

    isDeleted: z.boolean().default(false),
    isActive: z.boolean().default(true),
  }),
});

const updatePlanValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Plan Name is required' })
      .min(3, 'Plan name must be at least 3 characters')
      .optional(),
    cost: z
      .number({ required_error: 'Cost is required' })
      .min(0, 'Cost cannot be negative'),
    description: z
      .string({ required_error: 'Plan description is required' })
      .min(10, 'Description must be at least 10 characters')
      .optional(),

    features: z.object({
      teamMembers: z.boolean().default(false).optional(),
      sharedCalendar: z.boolean().default(false).optional(),
      taskHub: z.boolean().default(false).optional(),
      grantPermissionAccess: z.boolean().default(false).optional(),
    }),

    limits: z.object({
      serviceMax: z.number().min(0).default(0).optional(),
      productMax: z.number().min(0).default(0).optional(),
      highlightOfferMax: z.number().min(0).default(0).optional(),
      transactionFee: z.number().min(0).max(100).default(0).optional(),
    }),

    validity: z.object({
      type: z.enum(['unlimited', 'fixed']).optional(),
      durationInMonths: z.string().nullable().optional().optional(),
    }),

    isDeleted: z.boolean().default(false).optional(),
    isActive: z.boolean().default(true).optional(),
  }),
});

export const PlanValidations = {
  createPlanValidationSchema,
  updatePlanValidationSchema,
};
