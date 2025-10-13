import { Model, ObjectId } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TRole = 'customer' | 'owner' | 'freelance' | 'admin';

export type TStatus = 'ongoing' | 'confirmed' | 'blocked';

export type TGender = 'male' | 'female' | 'other';

export type TUser = {
  _id: ObjectId;
  fullName: string;
  phone: string;
  email: string;
  streetAddress: string;
  zipCode: string;
  city: string;
  state: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangeAt?: Date;
  referralCode?: string;
  gender?: TGender;
  role: TRole;
  status: TStatus;
  image?: string;
  isDeleted: boolean;
  isVerified: boolean;
  verification: {
    otp: string | number;
    expiresAt: Date;
    status: boolean;
  };
  // 🔹 Stripe customer ID for payments
  stripeCustomerId?: string;
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
