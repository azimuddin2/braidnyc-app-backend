import AppError from '../../errors/AppError';
import { TTerms } from './terms.interface';
import { Terms } from './terms.model';

const createTermsIntoDB = async (payload: TTerms) => {
  const result = await Terms.create(payload);
  if (!result) {
    throw new AppError(400, 'Failed to create terms');
  }
  return result;
};

const getTermsByIdFromDB = async (id: string) => {
  const result = await Terms.findById(id);

  if (!result) {
    throw new AppError(404, 'This Terms not found');
  }

  if (result.isDeleted === true) {
    throw new AppError(400, 'This terms has been deleted');
  }

  return result;
};

const updateTermsIntoDB = async (id: string, payload: Partial<TTerms>) => {
  const isTermsExists = await Terms.findById(id);

  if (!isTermsExists) {
    throw new AppError(404, 'This terms not exists');
  }

  if (isTermsExists.isDeleted === true) {
    throw new AppError(400, 'This terms has been deleted');
  }

  const updatedTerms = await Terms.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedTerms) {
    throw new AppError(400, 'Terms update failed');
  }

  return updatedTerms;
};

const deleteTermsFromDB = async (id: string) => {
  const isTermsExists = await Terms.findById(id);

  if (!isTermsExists) {
    throw new AppError(404, 'Terms not found');
  }

  const result = await Terms.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(400, 'Failed to delete Terms');
  }

  return result;
};

export const TermsService = {
  createTermsIntoDB,
  getTermsByIdFromDB,
  updateTermsIntoDB,
  deleteTermsFromDB,
};
