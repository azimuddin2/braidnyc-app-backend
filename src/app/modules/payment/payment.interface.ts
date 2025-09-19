import { Types } from 'mongoose';
import { TOrder } from '../order/order.interface';
import { TBooking } from '../booking/booking.interface';

export type TStatus = 'pending' | 'paid' | 'refunded';

export type TDeliveryStatus = 'pending' | 'ongoing' | 'shipped' | 'delivered';

export enum PAYMENT_MODEL_TYPE {
  Order = 'Order',
  Booking = 'Booking',
}

export type TPayment = {
  user: Types.ObjectId;
  vendor: Types.ObjectId;

  modelType: PAYMENT_MODEL_TYPE;
  reference: Types.ObjectId | TOrder | TBooking;

  status: TStatus;

  deliveryStatus?: TDeliveryStatus;

  trnId: string;
  adminAmount: number;
  vendorAmount: number;
  paymentIntentId: string;
  price: number;
  isDeleted: boolean;
};
