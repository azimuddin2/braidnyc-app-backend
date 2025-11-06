import { ObjectId } from 'mongoose';
import { TUser } from '../user/user.interface';

export type TSpecialist = {
  _id?: string;
  owner: ObjectId | TUser;
  name: string;
  image: string | null;
  isDeleted: boolean;
};
