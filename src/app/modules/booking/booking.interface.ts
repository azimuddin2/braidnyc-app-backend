import { Types } from 'mongoose';

export type TBookingStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'ongoing'
  | 'completed';
export type TPaymentType = 'half' | 'full' | 'later';
export type TPaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export type TBookingRequestType = 'none' | 'cancel' | 'reschedule';

export interface IBookingRequest {
  type?: TBookingRequestType;
  reason?: string;
  newDate?: string;
  newTime?: string;
  vendorApproved?: boolean;
  updatedAt?: Date;
}

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
  paymentType: TPaymentType;
  paymentStatus: TPaymentStatus;
  isDeleted: boolean;

  // Request field for cancel/reschedule
  request?: IBookingRequest;
};
