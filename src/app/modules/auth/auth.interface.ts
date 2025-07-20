import { TAccountType } from '../user/user.interface';

export type TLoginUser = {
  email: string;
  password: string;
};

export type TJwtPayload = {
  name?: string;
  email: string;
  accountType: TAccountType;
  iat?: number; // issued at (optional)
  exp?: number; // expiration (optional)
};
