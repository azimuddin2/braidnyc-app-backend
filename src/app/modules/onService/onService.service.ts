import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { TOnService } from './onService.interface';
import { User } from '../user/user.model';
import { OnService } from './onService.model';
import { onServiceSearchableFields } from './onService.constant';

const createOnServiceIntoDB = async (userId: string, payload: TOnService) => {
  const user = await User.findById(userId).select('role isRegistration');
  if (!user) throw new AppError(404, 'User not found');

  if (!['owner', 'freelancer'].includes(user.role)) {
    throw new AppError(403, 'Only owner or freelancer can create on service');
  }

  if (user.isRegistration === false) {
    throw new AppError(400, 'Registration not completed');
  }

  // ✅ Set the user field before saving
  payload.user = userId as any;

  const result = await OnService.create(payload);
  if (!result) {
    throw new AppError(400, 'Failed to create service');
  }

  return result;
};

const getAllOnServiceFromDB = async (query: Record<string, unknown>) => {
  const { user, ...filters } = query;

  if (!user || !mongoose.Types.ObjectId.isValid(user as string)) {
    throw new AppError(400, 'Invalid User ID');
  }

  // Base query -> always exclude deleted packages service
  let serviceQuery = OnService.find({ user, isDeleted: false });

  const queryBuilder = new QueryBuilder(serviceQuery, filters)
    .search(onServiceSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await queryBuilder.countTotal();
  const result = await queryBuilder.modelQuery;

  return { meta, result };
};

const getOnServiceByIdFromDB = async (id: string) => {
  const result = await OnService.findById(id).populate({
    path: 'user',
    select: '-password -needsPasswordChange',
  });

  if (!result) {
    throw new AppError(404, 'This on service not found');
  }

  return result;
};

const updateOnServiceIntoDB = async (
  userId: string,
  id: string,
  payload: Partial<TOnService>,
) => {
  const user = await User.findById(userId).select('role isRegistration');
  if (!user) throw new AppError(404, 'User not found');

  if (!['owner', 'freelancer'].includes(user.role)) {
    throw new AppError(403, 'Only owner or freelancer can create on service');
  }

  if (user.isRegistration === false) {
    throw new AppError(400, 'Registration not completed');
  }

  const isServiceExists = await OnService.findById(id);

  if (!isServiceExists) {
    throw new AppError(404, 'This on service is not found');
  }

  const result = await OnService.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new AppError(400, 'On Service update failed');
  }

  return result;
};

const deleteOnServiceFromDB = async (id: string) => {
  const isServiceExists = await OnService.findById(id);

  if (!isServiceExists) {
    throw new AppError(404, 'This on service is not found');
  }

  const result = await OnService.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(400, 'Failed to delete service');
  }

  return result;
};

export const OnServiceServices = {
  createOnServiceIntoDB,
  getAllOnServiceFromDB,
  getOnServiceByIdFromDB,
  updateOnServiceIntoDB,
  deleteOnServiceFromDB,
};
