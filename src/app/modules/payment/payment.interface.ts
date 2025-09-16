import { Model, Types } from 'mongoose';
import { TUser } from '../user/user.interface';
import { TOrder } from '../order/order.interface';
import { TBooking } from '../booking/booking.interface';
import { TVendor } from '../vendor/vendor.interface';

export enum PAYMENT_MODEL_TYPE {
  Order = 'Order',
  Booking = 'Booking',
}

export type TOrderPayment = {
  device: 'web' | 'mobile';

  user: Types.ObjectId | TUser;

  modelType: PAYMENT_MODEL_TYPE;

  reference: Types.ObjectId | TOrder | TBooking;

  vendor: Types.ObjectId | TVendor;

  amount: Number;

  status: 'paid' | 'pending' | 'cancel' | 'refound';

  isTransfer: boolean;

  tranId: string;

  paymentIntentId: string;

  adminAmount: number;

  transferAt: Date;
  isDeleted: boolean;
};

// export type TPaymentsModules = Model<TPayment, Record<string, unknown>>;
