import { model, Schema } from 'mongoose';
import { TTask } from './task.interface';
import { TaskStatus } from './task.constant';

const taskSchema = new Schema<TTask>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    assignTeamMember: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: TaskStatus,
        message: '{VALUE} is not valid',
      },
      default: 'To-Do',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Create model
export const Task = model<TTask>('Task', taskSchema);
