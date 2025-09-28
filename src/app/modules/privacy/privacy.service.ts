import AppError from '../../errors/AppError';
import { TPrivacy } from './privacy.interface';
import { Privacy } from './privacy.model';

const createPrivacyIntoDB = async (payload: TPrivacy) => {
  const result = await Privacy.create(payload);
  if (!result) {
    throw new AppError(400, 'Failed to create privacy');
  }
  return result;
};

const getPrivacyByIdFromDB = async (id: string) => {
  const result = await Privacy.findById(id);

  if (!result) {
    throw new AppError(404, 'This Privacy not found');
  }

  if (result.isDeleted === true) {
    throw new AppError(400, 'This privacy has been deleted');
  }

  return result;
};

const updatePrivacyIntoDB = async (id: string, payload: Partial<TPrivacy>) => {
  const isPrivacyExists = await Privacy.findById(id);

  if (!isPrivacyExists) {
    throw new AppError(404, 'This privacy not exists');
  }

  if (isPrivacyExists.isDeleted === true) {
    throw new AppError(400, 'This privacy has been deleted');
  }

  const updatedPrivacy = await Privacy.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedPrivacy) {
    throw new AppError(400, 'Privacy update failed');
  }

  return updatedPrivacy;
};

const deletePrivacyFromDB = async (id: string) => {
  const isPrivacyExists = await Privacy.findById(id);

  if (!isPrivacyExists) {
    throw new AppError(404, 'Privacy not found');
  }

  const result = await Privacy.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(400, 'Failed to delete privacy');
  }

  return result;
};

export const PrivacyService = {
  createPrivacyIntoDB,
  getPrivacyByIdFromDB,
  updatePrivacyIntoDB,
  deletePrivacyFromDB,
};
