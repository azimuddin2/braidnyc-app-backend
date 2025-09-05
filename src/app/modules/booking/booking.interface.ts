import { Types } from 'mongoose';

export type TBookingStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed';
export type TPaymentType = 'half' | 'full' | 'later';
export type TPaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export type TBooking = {
  service: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  serviceName: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  status: TBookingStatus;
  paymentType: TPaymentType;
  paymentStatus: TPaymentStatus;
  isDeleted: boolean;
};
