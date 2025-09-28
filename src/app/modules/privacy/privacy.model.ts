import mongoose, { Schema } from 'mongoose';
import { TPrivacy } from './privacy.interface';

const privacySchema = new Schema<TPrivacy>(
  {
    description: {
      type: String,
      required: [true, 'Privacy Description is required'],
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

export const Privacy = mongoose.model<TPrivacy>('Privacy', privacySchema);
