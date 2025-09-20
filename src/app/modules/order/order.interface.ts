import { Types } from 'mongoose';

export type TImage = {
  url: string;
  key: string;
};

export type TOrderStatus = 'pending' | 'shipped' | 'delivered';

export type TOrderRequestType = 'none' | 'cancelled' | 'return';

export type TOrderRequest = {
  type?: TOrderRequestType;
  images?: TImage[];
  deleteKey: string[];
  reason?: string;
  vendorApproved?: boolean;
  updatedAt?: Date;
};

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
