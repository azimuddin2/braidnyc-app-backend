import { model, Schema, Types } from 'mongoose';
import { TOrder } from './order.interface';
import { OrderStatus } from './order.constant';

const orderProductSchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    product: {
      type: Schema.Types.ObjectId,
      required: [true, 'Product Id is required'],
      ref: 'Product',
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
  },
  { _id: false }, // prevent creating extra _id for each product item
);

const orderSchema = new Schema<TOrder>(
  {
    products: {
      type: [orderProductSchema],
      required: true,
    },

    vendor: {
      type: Schema.Types.ObjectId,
      required: [true, 'Vendor Id is required'],
      ref: 'Vendor',
    },

    buyer: {
      type: Schema.Types.ObjectId,
      required: [true, 'User Id is required'],
      ref: 'User',
    },

    customerName: { type: String, required: true, trim: true },
    customerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    customerPhone: { type: String, required: true, trim: true },

    totalPrice: { type: Number, required: true },

    status: {
      type: String,
      enum: {
        values: OrderStatus,
        message: '{VALUE} is not valid',
      },
      default: 'pending',
    },

    isPaid: { type: Boolean, default: false },

    billingDetails: {
      country: { type: String, required: true },
      city: { type: String },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      address: { type: String, required: true },
    },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Order = model<TOrder>('Order', orderSchema);
