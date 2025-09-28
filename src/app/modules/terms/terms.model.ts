import mongoose, { Schema } from 'mongoose';
import { TTerms } from './terms.interface';

const termsSchema = new Schema<TTerms>(
  {
    content: {
      type: String,
      required: [true, 'Terms content is required'],
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

export const Terms = mongoose.model<TTerms>('Terms', termsSchema);
