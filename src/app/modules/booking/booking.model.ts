import { Schema, model } from 'mongoose';
import {
  SERVICE_MODEL_TYPE,
  TAddOnService,
  TBooking,
} from './booking.interface';
import {
  BookingRequest,
  BookingStatus,
  PaymentStatus,
} from './booking.constant';

const addOnServiceSchema = new Schema<TAddOnService>(
  {
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }, // optional: don't create separate _id for each add-on
);

const bookingSchema = new Schema<TBooking>(
  {
    vendor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    // Polymorphic service reference
    service: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'serviceType',
    },
    serviceType: {
      type: String,
      enum: Object.values(SERVICE_MODEL_TYPE),
      required: true,
    },

    // Array of add-on services
    addOnServices: [addOnServiceSchema],

    email: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },

    specialist: {
      type: String,
      required: false,
    },
    serviceLocation: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: BookingStatus,
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: PaymentStatus,
      default: 'pending',
    },
    request: {
      type: String,
      enum: BookingRequest,
      default: 'pending',
    },

    slotStart: { type: Number },
    slotEnd: { type: Number },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Booking = model<TBooking>('Booking', bookingSchema);
