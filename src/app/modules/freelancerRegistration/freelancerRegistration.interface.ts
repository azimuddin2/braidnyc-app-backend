import { ObjectId } from 'mongoose';
import { TUser } from '../user/user.interface';

export type TApprovalStatus = 'pending' | 'approved' | 'rejected';

export type TFreelancerRegistration = {
  user: ObjectId | TUser;
  profile: string;
  experienceYear: number;
  about: string;

  idDocument: string;
  businessRegistration?: string;

  openingHours: {
    enabled: boolean;
    day: string;
    openTime: string; // e.g. "09:00"
    closeTime: string; // e.g. "18:00"
  }[];

  approvalStatus: TApprovalStatus;
  availability: string[];

  salonPhoto: string | null;
  name: string;
  businessRegistrationNumber: number;

  location?: {
    streetAddress?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };

  city: string;
  postalCode: number;
  country: string;

  isDeleted: boolean;
};
