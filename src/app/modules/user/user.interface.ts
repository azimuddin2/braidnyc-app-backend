import { Model } from 'mongoose';
import { ACCOUNT_TYPE } from './user.constant';

export type TRegisterUser = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  accountType: 'service provider' | 'user' | 'admin';
  image?: string;
  country?: string;
  status: 'ongoing' | 'confirmed';
  isDeleted: boolean;
};

export interface UserModel extends Model<TRegisterUser> {
  isUserExistsByCustomId(id: string): Promise<TRegisterUser>;

  isPasswordMatched(
    plainTextPassword: string,
    hashPassword: string,
  ): Promise<boolean>;

  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof ACCOUNT_TYPE;
