import { Types } from 'mongoose';
import { TUser } from '../user/user.interface';

export type TBookingStatus = 'pending' | 'canceled' | 'completed';

export type TBookingRequest = 'pending' | 'approved' | 'decline';

export type TPaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export enum SERVICE_MODEL_TYPE {
  OwnerService = 'OwnerService',
  FreelancerService = 'FreelancerService',
}

export type TBooking = {
  vendor: Types.ObjectId | TUser;
  customer: Types.ObjectId | TUser;

  service: Types.ObjectId;
  serviceType: SERVICE_MODEL_TYPE;

  onServices: Types.ObjectId[];

  email: string;
  date: string;
  time: string;
  duration: string;

  specialist?: string;
  serviceLocation: string;
  image: string;
  notes: string;
  totalPrice: number;

  status: TBookingStatus;
  paymentStatus: TPaymentStatus;

  request?: TBookingRequest;

  slotStart?: number; // minutes since 00:00
  slotEnd?: number; // minutes since 00:00

  isDeleted: boolean;
};
