import { Types } from 'mongoose';

export type TOrderStatus = 'pending' | 'shipped' | 'delivered';

export type TOrderRequest = 'cancelled' | 'return';

export type TOrderProduct = {
  name: string;
  image: string;
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
  request: TOrderRequest;
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
