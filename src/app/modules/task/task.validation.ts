import { z } from 'zod';
import { TaskStatus } from './task.constant';

const createTaskValidationSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),

    description: z.string({
      required_error: 'Description is required',
    }),

    date: z.string({
      required_error: 'Date is required',
    }),

    time: z.string({
      required_error: 'Time is required',
    }),

    assignTeamMember: z.string({
      required_error: 'Team member is required',
    }),
  }),
});

const updateTaskValidationSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'Title is required',
      })
      .optional(),

    description: z
      .string({
        required_error: 'Description is required',
      })
      .optional(),

    date: z
      .string({
        required_error: 'Date is required',
      })
      .optional(),

    time: z
      .string({
        required_error: 'Time is required',
      })
      .optional(),

    assignTeamMember: z
      .string({
        required_error: 'Team member is required',
      })
      .optional(),
  }),
});

const updateTaskStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...TaskStatus] as [string, ...string[]]),
  }),
});

export const TaskValidations = {
  createTaskValidationSchema,
  updateTaskValidationSchema,
  updateTaskStatusValidationSchema,
};
