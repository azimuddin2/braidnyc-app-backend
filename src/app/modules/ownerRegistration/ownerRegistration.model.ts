import { model, Schema } from 'mongoose';
import { TOwnerRegistration } from './ownerRegistration.interface';
import { ApprovalStatus } from './ownerRegistration.constant';

const OpeningHourSchema = new Schema(
  {
    enabled: { type: Boolean, required: true, default: true },
    day: { type: String, required: true },
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true },
  },
  { _id: false },
);

const OwnerRegistrationSchema = new Schema<TOwnerRegistration>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User Id is required'],
      ref: 'User',
    },
    salonName: {
      type: String,
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
      required: [true, 'Business Registration is required'],
    },
    salonFrontPhoto: {
      type: String,
      required: [true, 'Salon front photo is required'],
    },
    salonInsidePhoto: {
      type: String,
      required: [true, 'Salon inside photo is required'],
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
    salonPhoto: {
      type: String,
    },
    businessRegistrationNumber: {
      type: Number,
    },

    // ✅ unified location field (object-based)
    location: {
      streetAddress: { type: String },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },

    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    avgRating: {
      type: Number,
      default: 0,
    },

    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export const OwnerRegistration = model<TOwnerRegistration>(
  'OwnerRegistration',
  OwnerRegistrationSchema,
);
