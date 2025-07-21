import { TAccountType } from '../user/user.interface';

export type TLoginUser = {
  email: string;
  password: string;
};

export type TJwtPayload = {
  name?: string;
  email: string;
  accountType: TAccountType;
  image?: string;
  iat?: number;
  exp?: number;
};

export type TchangePassword = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};
