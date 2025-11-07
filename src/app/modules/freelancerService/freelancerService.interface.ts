import { ObjectId } from 'mongoose';
import { TUser } from '../user/user.interface';

export type TImage = {
  url: string;
  key: string;
};

export type TServiceStatus = 'available' | 'unavailable';

export type TFreelancerService = {
  _id?: string;
  freelancer: ObjectId | TUser;

  studioFrontPhoto: string | null;
  studioInsidePhoto: string | null;

  name: string;
  duration: string;
  price: number;
  about: string;

  status: TServiceStatus;
  isDeleted: boolean;
};
