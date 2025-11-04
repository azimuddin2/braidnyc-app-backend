import { ObjectId } from 'mongoose';
import { TUser } from '../user/user.interface';

export type TImage = {
  url: string;
  key: string;
};

export type TGallery = {
  _id?: string;
  user: ObjectId | TUser;
  deleteKey: string[];
  images: TImage[];
  isDeleted: boolean;
};
