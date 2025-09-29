import { model, Schema } from 'mongoose';
import { TServiceType } from './serviceType.interface';

const serviceTypeSchema = new Schema<TServiceType>(
  {
    name: {
      type: String,
      required: true,
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

export const ServiceType = model<TServiceType>(
  'ServiceType',
  serviceTypeSchema,
);
