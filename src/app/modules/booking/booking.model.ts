import { Schema, model } from 'mongoose';
import { TBooking } from './booking.interface';

const BookingSchema = new Schema<TBooking>(
  {
    serviceType: {
      type: String,
      enum: ['owner', 'freelancer'],
      required: true,
    },

    // Dynamically reference service based on serviceType
    service: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'serviceType',
    },

    // Dynamically reference vendor (owner or freelancer)
    vendor: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'serviceType',
    },

    customer: { type: Schema.Types.ObjectId, required: true, ref: 'User' },

    email: { type: String, required: true },

    date: { type: String, required: true },
    time: { type: String, required: true },
    duration: { type: String, required: true },
    totalPrice: { type: Number, required: true },

    status: {
      type: String,
      enum: ['pending', 'canceled', 'completed'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'failed'],
      default: 'pending',
    },

    image: { type: String },
    notes: { type: String },

    request: {
      type: String,
      enum: ['pending', 'approved', 'decline'],
      default: 'pending',
    },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Booking = model<TBooking>('Booking', BookingSchema);
