import { Types } from 'mongoose';

export type TOrderStatus =
  | 'pending'
  | 'shipped'
  | 'cancelled'
  | 'delivered'
  | 'return';

export type TOrderProduct = {
  product: Types.ObjectId;
  quantity: number;
  price: number;
  discount: number;
};

export type TOrder = {
  products: TOrderProduct[];
  vendor: Types.ObjectId;
  buyer: Types.ObjectId;

  customerName: string;
  customerEmail: string;
  customerPhone: string;

  totalPrice: number;

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
