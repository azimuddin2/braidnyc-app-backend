import jwt, { Secret } from 'jsonwebtoken';
import { TJwtPayload } from './auth.interface';

export const createToken = (
  jwtPayload: TJwtPayload,
  secret: Secret,
  expiresIn: any,
) => {
  return jwt.sign(jwtPayload, secret, expiresIn);
};
