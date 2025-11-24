import { Schema, model } from 'mongoose';
import { SERVICE_MODEL_TYPE, TBooking } from './booking.interface';
import {
  BookingRequest,
  BookingStatus,
  PaymentStatus,
} from './booking.constant';

const bookingSchema = new Schema<TBooking>(
  {
    vendor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Main Service (OwnerService or FreelancerService)
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

    // Multiple Services (array of service IDs)
    onServices: [
      {
        type: Schema.Types.ObjectId,
        ref: 'OnService', // If you want polymorphic here too, tell me
      },
    ],

    email: {
      type: String,
      required: true,
    },

    date: { type: String, required: true },
    time: { type: String, required: true },
    duration: { type: String, required: true },

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
      enum: {
        values: BookingStatus,
        message: '{VALUE} is not valid',
      },
      default: 'pending',
    },

    paymentStatus: {
      type: String,
      enum: {
        values: PaymentStatus,
        message: '{VALUE} is not valid',
      },
      default: 'pending',
    },

    request: {
      type: String,
      enum: {
        values: BookingRequest,
        message: '{VALUE} is not valid',
      },
      default: 'pending',
    },

    slotStart: { type: Number }, // minutes since 00:00
    slotEnd: { type: Number }, // minutes since 00:00

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Booking = model<TBooking>('Booking', bookingSchema);
