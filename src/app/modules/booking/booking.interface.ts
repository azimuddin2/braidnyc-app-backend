import { Types } from 'mongoose';
import { TUser } from '../user/user.interface';

export type TBookingStatus = 'pending' | 'canceled' | 'completed';

export type TBookingRequest = 'pending' | 'approved' | 'decline';

export type TPaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export enum SERVICE_MODEL_TYPE {
  OwnerService = 'OwnerService',
  FreelancerService = 'FreelancerService',
}

export type TAddOnService = {
  name: string;
  qty: number;
  price: number;
};

export type TBooking = {
  vendor: Types.ObjectId | TUser; //Owner and Freelancer ID
  customer: Types.ObjectId | TUser;

  service: Types.ObjectId;
  serviceType: SERVICE_MODEL_TYPE;

  addOnServices: TAddOnService[];

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

  request: TBookingRequest;

  slotStart?: number;
  slotEnd?: number;

  isDeleted: boolean;
};
