import { Model } from 'mongoose';
import { ACCOUNT_TYPE } from './user.constant';

export type TAccountType = 'service provider' | 'user' | 'admin';

export type TRegisterUser = {
  firstName: string;
  lastName: string;
  fullName?: string; // For virtual
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  accountType: TAccountType;
  image?: string;
  country?: string;
  status: 'ongoing' | 'confirmed';
  isDeleted: boolean;
};

export interface UserModel extends Model<TRegisterUser> {
  isPasswordMatched(
    plainTextPassword: string,
    hashPassword: string,
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof ACCOUNT_TYPE;
