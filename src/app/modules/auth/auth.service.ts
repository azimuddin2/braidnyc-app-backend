import AppError from '../../errors/AppError';
import { TChangePassword, TJwtPayload, TLoginUser } from './auth.interface';
import config from '../../config';
import { User } from '../user/user.model';
import { verifyToken } from '../../utils/verifyToken';
import { createToken } from './auth.utils';
import { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { generateOtp } from '../../utils/generateOtp';
import moment from 'moment';
import { sendEmail } from '../../utils/sendEmail';

const loginUser = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    throw new AppError(404, 'This user is not found!');
  }

  if (user?.isDeleted === true) {
    throw new AppError(403, 'This user is deleted!');
  }

  if (user?.status === 'blocked') {
    throw new AppError(403, 'This user is blocked!');
  }

  // checking if the password is correct
  const isPasswordMatched = await User.isPasswordMatched(
    payload?.password,
    user?.password,
  );
  if (!isPasswordMatched) {
    throw new AppError(403, 'Password do not matched!');
  }

  // create token and sent to the client
  const jwtPayload: TJwtPayload = {
    userId: user._id.toString(),
    name: user?.fullName,
    email: user?.email,
    role: user?.role,
    image: user?.image,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(401, 'You are not authorized!');
  }

  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { email, iat } = decoded;

  const user = await User.findOne({ email: email });

  if (!user) {
    throw new AppError(404, 'This user is not found!');
  }

  if (user?.isDeleted === true) {
    throw new AppError(403, 'This user is deleted!');
  }

  if (user?.status === 'blocked') {
    throw new AppError(403, 'This user is blocked!');
  }

  // create token and sent to the client
  const jwtPayload: TJwtPayload = {
    userId: user._id.toString(),
    name: user?.fullName,
    email: user?.email,
    role: user?.role,
    image: user?.image,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: TChangePassword,
) => {
  const user = await User.isUserExistsByEmail(userData?.email);

  if (!user) {
    throw new AppError(404, 'This user is not found!');
  }

  if (user?.isDeleted === true) {
    throw new AppError(403, 'This user is deleted!');
  }

  if (user?.status === 'blocked') {
    throw new AppError(403, 'This user is blocked!');
  }

  // checking if the password is correct
  const isPasswordMatched = await User.isPasswordMatched(
    payload?.oldPassword,
    user?.password,
  );
  if (!isPasswordMatched) {
    throw new AppError(403, 'Password do not matched!');
  }

  // hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      _id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: true,
      passwordChangeAt: new Date(),
    },
  );

  return null;
};

const forgetPassword = async (email: string) => {
  const user = await User.isUserExistsByEmail(email);

  if (!user) {
    throw new AppError(404, 'This user is not found!');
  }

  if (user?.isDeleted === true) {
    throw new AppError(403, 'This user is deleted!');
  }

  if (user?.status === 'blocked') {
    throw new AppError(403, 'This user is blocked!');
  }

  // create token and sent to the client
  const jwtPayload: TJwtPayload = {
    userId: user?._id.toString(),
    email: user?.email,
    role: user?.role,
  };

  const token = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '2m',
  );

  const currentTime = new Date();
  const otp = generateOtp();
  const expiresAt = moment(currentTime).add(2, 'minute');
  await User.findByIdAndUpdate(user?._id, {
    verification: {
      otp,
      expiresAt,
      status: true,
    },
  });

  await sendEmail(
    email,
    'Your OTP for Password Reset',
    `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 24px; border-radius: 10px; border: 1px solid #e0e0e0;">
    <h2 style="color: #4CAF50; text-align: center; margin-top: 0;">Password Reset OTP</h2>
    
    <p style="font-size: 16px; color: #333; text-align: center;">
      We received a request to reset your password. Use the one-time password (OTP) below:
    </p>

    <div style="background-color: #f4f4f4; padding: 20px; margin: 20px auto; border-radius: 6px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
      <p style="font-size: 18px; color: #013B23; margin-bottom: 10px;">Your OTP:</p>
      <p style="font-size: 32px; color: #4CAF50; font-weight: bold; margin: 0;">${otp}</p>
    </div>

    <p style="font-size: 14px; color: #666; text-align: center; margin-top: 20px;">
      This OTP is valid until:
    </p>
    <p style="font-size: 14px; color: #013B23; text-align: center; font-weight: bold; margin: 0;">
      ${expiresAt.toLocaleString()}
    </p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;" />

    <p style="font-size: 13px; color: #999; text-align: center;">
      If you did not request this, please ignore this email.
    </p>
  </div>
  `,
  );

  return { email, token };
};

export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgetPassword,
};
