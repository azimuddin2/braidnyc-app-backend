import { Types } from 'mongoose';

export type TOrderStatus =
  | 'pending'
  | 'shipped'
  | 'cancelled'
  | 'delivered'
  | 'return';

export type TOrder = {
  product: Types.ObjectId;
  vendor: Types.ObjectId;
  buyer: Types.ObjectId;

  customerName: string;
  customerEmail: string;
  customerPhone: string;

  totalPrice: number;
  discount: number;
  quantity: number;
  status: TOrderStatus;
  isPaid: boolean;
  billingDetails: {
    country: string;
    city?: string;
    state: string;
    zipCode: string;
    address: string;
  };
  isDeleted: boolean;
};
