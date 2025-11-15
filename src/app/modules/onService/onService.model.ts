import { Schema, model } from 'mongoose';
import { TOnService } from './onService.interface';
import { OnServiceStatus } from './onService.constant';

const OnServiceSchema = new Schema<TOnService>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User Id is required'],
      ref: 'User',
    },
    name: {
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
        values: OnServiceStatus,
        message: '{VALUE} is not valid',
      },
      default: 'available',
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const OnService = model<TOnService>('OnService', OnServiceSchema);
