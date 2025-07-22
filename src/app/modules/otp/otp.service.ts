import moment from 'moment';
import config from '../../config';
import AppError from '../../errors/AppError';
import { verifyToken } from '../../utils/verifyToken';
import { User } from '../user/user.model';
import { TJwtPayload } from '../auth/auth.interface';
import { Secret } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import { TVerifyOtp } from './otp.interface';

const verifyOtp = async (token: string, otp: TVerifyOtp) => {
  if (!token) {
    throw new AppError(401, 'You are not authorized!');
  }

  const decoded = verifyToken(token, config.jwt_access_secret as string);

  const { email } = decoded;

  const user = await User.findOne({ email: email }).select(
    'verification isVerified',
  );

  if (!user) {
    throw new AppError(404, 'This user is not found!');
  }

  if (user?.isDeleted === true) {
    throw new AppError(403, 'This user is deleted!');
  }

  if (user?.status === 'blocked') {
    throw new AppError(403, 'This user is blocked!');
  }

  const verifyExpiresAt = user?.verification?.expiresAt;
  if (new Date() > verifyExpiresAt) {
    throw new AppError(400, 'otp has expired. Please resend it');
  }

  const verifyOtpCode = Number(user?.verification?.otp);
  if (Number(otp) !== verifyOtpCode) {
    throw new AppError(400, 'otp did not match');
  }

  const updateUser = await User.findByIdAndUpdate(
    user?._id,
    {
      $set: {
        isVerified: user?.isVerified === false ? true : user?.isVerified,
        verification: {
          otp: 0,
          expiresAt: moment().add(3, 'minute'),
          status: true,
        },
      },
    },
    { new: true },
  );

  // create token and sent to the client
  const jwtPayload: TJwtPayload = {
    userId: user._id.toString(),
    email: user?.email,
    role: user?.role,
  };

  const jwtToken = jwt.sign(jwtPayload, config.jwt_access_secret as Secret, {
    expiresIn: '3m',
  });

  return { user: updateUser, token: jwtToken };
};

export const OtpServices = {
  verifyOtp,
};
