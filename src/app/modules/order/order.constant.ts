import { TOrderRequestType, TOrderStatus } from './order.interface';

export const OrderStatus: TOrderStatus[] = ['pending', 'shipped', 'delivered'];

export const OrderRequest: TOrderRequestType[] = [
  'cancelled',
  'return',
  'none',
];

export const orderSearchableFields = [
  'customerName',
  'customerEmail',
  'customerPhone',
  'status',
];
