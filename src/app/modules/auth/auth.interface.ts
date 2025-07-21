import { TRole } from '../user/user.interface';

export type TLoginUser = {
  email: string;
  password: string;
};

export type TJwtPayload = {
  userId: string;
  name?: string;
  email: string;
  role: TRole;
  image?: string;
  iat?: number;
  exp?: number;
};

export type TChangePassword = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};
