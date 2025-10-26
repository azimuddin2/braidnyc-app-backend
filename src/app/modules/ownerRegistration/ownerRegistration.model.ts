import { model, Schema } from 'mongoose';
import { TOwnerRegistration } from './ownerRegistration.interface';

const OpeningHourSchema = new Schema(
  {
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
  },
  {
    timestamps: true,
  },
);

export const OwnerRegistrationModel = model<TOwnerRegistration>(
  'OwnerRegistration',
  OwnerRegistrationSchema,
);
