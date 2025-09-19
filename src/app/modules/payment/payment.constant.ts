import { TDeliveryStatus, TStatus } from './payment.interface';

export const Status: TStatus[] = ['pending', 'paid', 'refunded'];

export enum PAYMENT_STATUS {
  pending = 'pending',
  paid = 'paid',
  refunded = 'refunded',
}

export const DeliveryStatus: TDeliveryStatus[] = [
  'pending',
  'ongoing',
  'shipped',
  'delivered',
];
