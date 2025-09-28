import mongoose, { Schema } from 'mongoose';
import { TPolicy } from './policy.interface';

const policySchema = new Schema<TPolicy>(
  {
    content: {
      type: String,
      required: [true, 'Policy content is required'],
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

export const Policy = mongoose.model<TPolicy>('Policy', policySchema);
