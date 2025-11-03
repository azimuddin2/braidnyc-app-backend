import { Types } from 'mongoose';
import { TUser } from '../user/user.interface';

export type TSpecialist = {
  _id?: string;
  user: Types.ObjectId | TUser;
  name: string;
  image: string | null;
  isDeleted: boolean;
};
