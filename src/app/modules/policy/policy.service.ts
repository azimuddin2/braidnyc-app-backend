import AppError from '../../errors/AppError';
import { TPolicy } from './policy.interface';
import { Policy } from './policy.model';

const createPolicyIntoDB = async (payload: TPolicy) => {
  const result = await Policy.create(payload);
  if (!result) {
    throw new AppError(400, 'Failed to create policy');
  }
  return result;
};

const getPolicyByIdFromDB = async (id: string) => {
  const result = await Policy.findById(id);

  if (!result) {
    throw new AppError(404, 'This Policy not found');
  }

  if (result.isDeleted === true) {
    throw new AppError(400, 'This Policy has been deleted');
  }

  return result;
};

const updatePolicyIntoDB = async (id: string, payload: Partial<TPolicy>) => {
  const isPolicyExists = await Policy.findById(id);

  if (!isPolicyExists) {
    throw new AppError(404, 'This policy not exists');
  }

  if (isPolicyExists.isDeleted === true) {
    throw new AppError(400, 'This policy has been deleted');
  }

  const updatedPolicy = await Policy.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedPolicy) {
    throw new AppError(400, 'Policy update failed');
  }

  return updatedPolicy;
};

const deletePolicyFromDB = async (id: string) => {
  const isPolicyExists = await Policy.findById(id);

  if (!isPolicyExists) {
    throw new AppError(404, 'Policy not found');
  }

  const result = await Policy.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(400, 'Failed to delete policy');
  }

  return result;
};

export const PolicyService = {
  createPolicyIntoDB,
  getPolicyByIdFromDB,
  updatePolicyIntoDB,
  deletePolicyFromDB,
};
