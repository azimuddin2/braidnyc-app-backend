import { TOrderRequest, TOrderStatus } from './order.interface';

export const OrderStatus: TOrderStatus[] = ['pending', 'shipped', 'delivered'];

export const OrderRequest: TOrderRequest[] = ['cancelled', 'return'];
