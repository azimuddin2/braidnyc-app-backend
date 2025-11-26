import { TStatus } from './payment.interface';

export const Status: TStatus[] = ['pending', 'paid', 'refunded', 'cancelled'];

export enum PAYMENT_STATUS {
  pending = 'pending',
  paid = 'paid',
  refunded = 'refunded',
  cancelled = 'cancelled',
}
