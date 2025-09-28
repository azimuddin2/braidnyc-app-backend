import mongoose, { Schema } from 'mongoose';
import { TPolicy } from './policy.interface';

const policySchema = new Schema<TPolicy>(
  {
    description: {
      type: String,
      required: [true, 'Policy Description is required'],
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
