import { Schema, model } from 'mongoose';
import { TPayment } from './payment.interface';
import { Status } from './payment.constant';

const paymentSchema = new Schema<TPayment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: Status,
        message: '{VALUE} is not valid',
      },
      default: 'pending',
    },
    trnId: {
      type: String,
      required: true,
    },
    adminAmount: {
      type: Number,
      required: true,
    },
    vendorAmount: {
      type: Number,
      required: true,
    },
    paymentIntentId: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

paymentSchema.pre('save', function (next) {
  if (
    this.isModified('price') ||
    this.adminAmount == null ||
    this.vendorAmount == null
  ) {
    this.adminAmount = Number(this.price) * 0.1; // 10% commission
    this.vendorAmount = Number(this.price) * 0.9; // 90% vendor earning
  }
  next();
});

export const Payment = model<TPayment>('Payment', paymentSchema);
