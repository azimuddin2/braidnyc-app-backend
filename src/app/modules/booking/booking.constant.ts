import {
  TBookingStatus,
  TPaymentStatus,
  TPaymentType,
} from './booking.interface';

export const BookingStatus: TBookingStatus[] = [
  'pending',
  'ongoing',
  'confirmed',
  'cancelled',
  'completed',
];

export const PaymentType: TPaymentType[] = ['half', 'full', 'later'];

export const PaymentStatus: TPaymentStatus[] = [
  'pending',
  'paid',
  'refunded',
  'failed',
];

export const bookingSearchableFields = [
  'name',
  'email',
  'phone',
  'status',
  'serviceName',
];
