import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TRole = 'service_provider' | 'user' | 'admin';

export type TStatus = 'ongoing' | 'confirmed' | 'blocked';

export type TUser = {
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  needsPasswordChange: boolean;
  passwordChangeAt?: Date;
  role: TRole;
  image?: string;
  country?: string;
  status: TStatus;
  isDeleted: boolean;
};

export interface UserModel extends Model<TUser> {
  isUserExistsByEmail(email: string): Promise<TUser>;

  isPasswordMatched(
    plainTextPassword: string,
    hashPassword: string,
  ): Promise<boolean>;

  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
