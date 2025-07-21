import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { TVendor } from '../vendor/vendor.interface';
import { TUser } from './user.interface';
import { User } from './user.model';
import { Vendor } from '../vendor/vendor.model';

const registerUserIntoDB = async (payload: TUser) => {
  const filter = { email: payload.email };

  const isUserExists = await User.findOne(filter);
  if (isUserExists) {
    throw new AppError(409, `${payload.email} already exists.`);
  }

  if (payload.password !== payload.confirmPassword) {
    throw new AppError(403, 'Password do not matched!');
  }

  const result = await User.create(payload);
  return result;
};

const vendorRegisterUserIntoDB = async (payload: TVendor) => {
  if (payload.password !== payload.confirmPassword) {
    throw new AppError(403, 'Password does not match!');
  }

  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new AppError(409, `${payload.email} already exists.`);
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Prepare user data
    const userData = {
      ...payload,
      role: 'service provider',
    };

    const createdUser = await User.create([userData], { session });
    if (!createdUser.length) {
      throw new AppError(400, 'Failed to create user');
    }

    const createdVendor = await Vendor.create([payload], { session });
    if (!createdVendor.length) {
      throw new AppError(400, 'Failed to create vendor');
    }

    await session.commitTransaction();
    session.endSession();

    return createdVendor[0];
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(500, error.message || 'Vendor registration failed');
  }
};

export const UserServices = {
  registerUserIntoDB,
  vendorRegisterUserIntoDB,
};
