import { Schema, model } from 'mongoose';
import { TOwnerService } from './ownerService.interface';
import { ServiceStatus } from './ownerService.constant';

const imageSchema = new Schema(
  {
    url: { type: String, required: true },
    key: { type: String, required: true },
  },
  { _id: false },
);

const ownerServiceSchema = new Schema<TOwnerService>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: [true, 'Owner Id is required'],
      ref: 'User',
    },
    deleteKey: [{ type: String, required: true }],
    images: {
      type: [imageSchema],
      required: true,
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
    status: {
      type: String,
      enum: {
        values: ServiceStatus,
        message: '{VALUE} is not valid',
      },
      default: 'available',
    },
    description: {
      type: String,
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const OwnerService = model<TOwnerService>(
  'OwnerService',
  ownerServiceSchema,
);
