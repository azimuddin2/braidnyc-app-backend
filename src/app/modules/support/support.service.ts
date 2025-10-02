import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { supportSearchableFields } from './support.constant';
import { TSupport } from './support.interface';
import { Support } from './support.modal';

const createSupportIntoDB = async (payload: TSupport) => {
  const result = await Support.create(payload);
  if (!result) {
    throw new AppError(400, 'Failed to create Support');
  }
  return result;
};

const getAllSupportFromDB = async (query: Record<string, unknown>) => {
  const supportQuery = new QueryBuilder(
    Support.find({ isDeleted: false }),
    query,
  )
    .search(supportSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await supportQuery.countTotal();
  const result = await supportQuery.modelQuery;

  return { meta, result };
};

const getSupportByIdFromDB = async (id: string) => {
  const result = await Support.findById(id);

  if (!result) {
    throw new AppError(404, 'This support not found');
  }

  if (result.isDeleted === true) {
    throw new AppError(400, 'This support has been deleted');
  }

  return result;
};

const updateSupportIntoDB = async (id: string, payload: Partial<TSupport>) => {
  const isSupportExists = await Support.findById(id);

  if (!isSupportExists) {
    throw new AppError(404, 'This support not exists');
  }

  if (isSupportExists.isDeleted === true) {
    throw new AppError(400, 'This support has been deleted');
  }

  const updatedSupport = await Support.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedSupport) {
    throw new AppError(400, 'Support update failed');
  }

  return updatedSupport;
};

const deleteSupportFromDB = async (id: string) => {
  const isSupportExists = await Support.findById(id);

  if (!isSupportExists) {
    throw new AppError(404, 'Support not found');
  }

  const result = await Support.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(400, 'Failed to delete support');
  }

  return result;
};

export const SupportServices = {
  createSupportIntoDB,
  getAllSupportFromDB,
  getSupportByIdFromDB,
  updateSupportIntoDB,
  deleteSupportFromDB,
};
