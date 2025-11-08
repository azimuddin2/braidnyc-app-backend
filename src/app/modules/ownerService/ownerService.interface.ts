import { ObjectId, Types } from 'mongoose';
import { TUser } from '../user/user.interface';

export type TImage = {
  url: string;
  key: string;
};

export type TServiceStatus = 'available' | 'unavailable';

export type TOwnerService = {
  _id?: string;
  owner: ObjectId | TUser;
  deleteKey: string[];
  images: TImage[];
  name: string;
  time: string;
  price: number;
  description: string;
  status: TServiceStatus;

  isDeleted: boolean;
};
