import { Schema, model } from 'mongoose';
import { TFreelancerService } from './freelancerService.interface';
import { ServiceStatus } from './freelancerService.constant';

const freelancerServiceSchema = new Schema<TFreelancerService>(
  {
    freelancer: {
      type: Schema.Types.ObjectId,
      required: [true, 'Freelancer id is required'],
      ref: 'User',
    },
    studioFrontPhoto: {
      type: String,
      required: [true, 'Studio front photo is required'],
    },
    studioInsidePhoto: {
      type: String,
      required: [true, 'Studio inside photo is required'],
    },
    name: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ServiceStatus,
        message: '{VALUE} is not valid',
      },
      default: 'available',
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const FreelancerService = model<TFreelancerService>(
  'FreelancerService',
  freelancerServiceSchema,
);
