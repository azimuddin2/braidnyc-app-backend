import { ObjectId } from 'mongoose';
import { TUser } from '../user/user.interface';

export type TApprovalStatus = 'pending' | 'approved' | 'rejected';

export type TAvailability = 'salon' | 'mobile' | 'home';

export type TFreelancerRegistration = {
  user: ObjectId | TUser;
  profile: string;
  experienceYear: number;
  about: string;

  idDocument: string;
  businessRegistration?: string;

  openingHours: {
    day: string;
    openTime: string; // e.g. "09:00"
    closeTime: string; // e.g. "18:00"
  }[];

  approvalStatus: TApprovalStatus;

  availability: TAvailability;
};
