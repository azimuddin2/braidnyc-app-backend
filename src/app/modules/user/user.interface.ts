import { Model, ObjectId } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TRole = 'customer' | 'owner' | 'freelancer' | 'admin';

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
  selectSalon?: string;
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
  isRegistration: boolean;
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
