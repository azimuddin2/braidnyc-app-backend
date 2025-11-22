import { Types } from 'mongoose';

export type TBookingStatus = 'pending' | 'canceled' | 'completed';

export type TBookingRequest = 'pending' | 'approved' | 'decline';

export type TPaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export type TBooking = {
  vendor: Types.ObjectId; // Owner and Freelancer
  customer: Types.ObjectId;
  service: Types.ObjectId;

  email: string;

  date: string;
  time: string;
  duration: string;
  totalPrice: number;

  status: TBookingStatus;
  paymentStatus: TPaymentStatus;

  image: string;
  notes: string;

  request?: TBookingRequest;

  isDeleted: boolean;
};
