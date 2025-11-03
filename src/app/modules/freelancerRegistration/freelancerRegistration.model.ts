import { model, Schema } from 'mongoose';
import { TFreelancerRegistration } from './freelancerRegistration.interface';
import {
  ApprovalStatus,
  Availability,
} from './freelancerRegistration.constant';

const OpeningHourSchema = new Schema(
  {
    day: { type: String, required: true },
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true },
  },
  { _id: false },
);

const FreelancerRegistrationSchema = new Schema<TFreelancerRegistration>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User Id is required'],
      ref: 'User',
    },
    profile: {
      type: String,
      required: [true, 'Profile Picture is required'],
    },
    experienceYear: {
      type: Number,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    idDocument: {
      type: String,
      required: [true, 'ID Document is required'],
    },
    businessRegistration: {
      type: String,
    },
    openingHours: {
      type: [OpeningHourSchema],
      required: true,
    },
    approvalStatus: {
      type: String,
      enum: {
        values: ApprovalStatus,
        message: '{VALUE} is not valid',
      },
      default: 'pending',
    },
    availability: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const FreelancerRegistration = model<TFreelancerRegistration>(
  'FreelancerRegistration',
  FreelancerRegistrationSchema,
);
