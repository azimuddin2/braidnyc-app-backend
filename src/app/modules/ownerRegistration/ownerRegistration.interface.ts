import { ObjectId } from 'mongoose';
import { TUser } from '../user/user.interface';

export type TOwnerRegistration = {
  user: ObjectId | TUser;
  salonName: string;
  about: string;
  idDocument: string;
  businessRegistration: string;
  salonFrontPhoto: string;
  salonInsidePhoto: string;
  openingHours: {
    day: string;
    openTime: string; // e.g. "09:00"
    closeTime: string; // e.g. "18:00"
  }[];

  salonPhoto?: string;
  businessRegistrationNumber?: number;

  location?: {
    streetAddress?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
};
