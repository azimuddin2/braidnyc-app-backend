import { Types } from 'mongoose';
import { TUser } from '../user/user.interface';
import { TBooking } from '../booking/booking.interface';

export type TStatus = 'pending' | 'paid' | 'refunded' | 'cancelled';

export type TPayment = {
  user: Types.ObjectId | TUser;
  vendor: Types.ObjectId | TUser;

  booking: Types.ObjectId | TBooking;

  status: TStatus;

  trnId: string;
  adminAmount: number;
  vendorAmount: number;
  paymentIntentId: string;
  price: number;
  isPaid: boolean;
  isDeleted: boolean;
};
