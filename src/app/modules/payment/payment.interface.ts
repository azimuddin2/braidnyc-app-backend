import { Model, Types } from 'mongoose';

export type TStatus = 'pending' | 'paid' | 'refunded';
export type TDeliveryStatus = 'pending' | 'ongoing' | 'shipped' | 'delivered';

export enum PAYMENT_MODEL_TYPE {
  Order = 'Order',
  Booking = 'Booking',
}

export type TBasePayment = {
  user: Types.ObjectId;
  vendor: Types.ObjectId;

  modelType: PAYMENT_MODEL_TYPE; // 👈 important for discriminating

  status: TStatus;
  trnId: string;

  adminAmount: number; // platform commission
  vendorAmount: number; // vendor earnings
  paymentIntentId?: string; // optional (for Stripe/PayPal etc.)
  price: number;

  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * 🔹 Order Payment
 */
export type TOrderPayment = TBasePayment & {
  modelType: PAYMENT_MODEL_TYPE.Order;
  order: Types.ObjectId;
  deliveryStatus: TDeliveryStatus;
};

/**
 * 🔹 Booking Payment
 */
export type TBookingPayment = TBasePayment & {
  modelType: PAYMENT_MODEL_TYPE.Booking;
  booking: Types.ObjectId;
};

/**
 * 🔹 Union of Payments
 */
export type TPayment = TOrderPayment | TBookingPayment;

/**
 * 🔹 Payment Model Type
 */
export type TPaymentModules = Model<TPayment, Record<string, unknown>>;
