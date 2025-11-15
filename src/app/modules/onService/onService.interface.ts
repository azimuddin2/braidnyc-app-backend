import { ObjectId } from 'mongoose';
import { TUser } from '../user/user.interface';

export type TOnServiceStatus = 'available' | 'unavailable';

export type TOnService = {
  _id?: string;
  user: ObjectId | TUser;

  name: string;
  price: number;
  about: string;

  status: TOnServiceStatus;
  isDeleted: boolean;
};
