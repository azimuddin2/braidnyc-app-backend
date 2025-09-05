import { model, Schema } from 'mongoose';
import { TBooking } from './booking.interface';
import { BookingStatus, PaymentStatus, PaymentType } from './booking.constant';

const bookingSchema = new Schema<TBooking>(
  {
    service: {
      type: Schema.Types.ObjectId,
      required: [true, 'Service Id is required'],
      ref: 'Packages',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    serviceName: {
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
    price: {
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
    paymentType: {
      type: String,
      enum: {
        values: PaymentType,
        message: '{VALUE} is not valid',
      },
      default: 'full',
    },
    paymentStatus: {
      type: String,
      enum: {
        values: PaymentStatus,
        message: '{VALUE} is not valid',
      },
      default: 'pending',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// ✅ Enforce one-slot-one-booking
bookingSchema.index(
  { service: 1, serviceName: 1, date: 1, time: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

export const Booking = model<TBooking>('Booking', bookingSchema);
