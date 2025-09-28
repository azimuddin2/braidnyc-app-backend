import mongoose, { Schema } from 'mongoose';
import { TPrivacy } from './privacy.interface';

const privacySchema = new Schema<TPrivacy>(
  {
    content: {
      type: String,
      required: [true, 'Privacy content is required'],
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
