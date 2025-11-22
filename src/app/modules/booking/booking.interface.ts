import { Types } from 'mongoose';

export type TBookingStatus = 'pending' | 'canceled' | 'completed';

export type TBookingRequest = 'pending' | 'approved' | 'decline';

// export type TPaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export type TBooking = {
  vendor: Types.ObjectId;
  user: Types.ObjectId;
  serviceId: string;
  service: Types.ObjectId;
  serviceItemId: string;

  name: string;
  email: string;
  phone: string;

  serviceName: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  status: TBookingStatus;
  // paymentStatus: TPaymentStatus;
  isDeleted: boolean;

  request?: TBookingRequest;
};
