import { Schema, model } from 'mongoose';
import { TReview } from './review.interface';

const ReviewSchema = new Schema<TReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },

    // 🎯 One of these will be present — freelancer or owner
    freelancer: {
      type: Schema.Types.ObjectId,
      ref: 'FreelancerRegistration',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'OwnerRegistration',
    },

    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Minimum rating is 1'],
      max: [5, 'Maximum rating is 5'],
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

export const Review = model<TReview>('Review', ReviewSchema);
