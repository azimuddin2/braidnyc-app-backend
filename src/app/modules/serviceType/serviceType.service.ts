import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { TServiceType } from './serviceType.interface';
import { ServiceType } from './serviceType.model';
import { serviceTypeSearchableFields } from './serviceType.constant';

const createServiceTypeIntoDB = async (payload: TServiceType) => {
  const filter = { name: payload.name };

  const isServiceTypeExists = await ServiceType.findOne(filter);

  if (isServiceTypeExists) {
    throw new AppError(404, 'This service type already exists');
  }

  const result = await ServiceType.create(payload);
  if (!result) {
    throw new AppError(400, 'Failed to create service type');
  }
  return result;
};

const getAllServiceTypeFromDB = async (query: Record<string, unknown>) => {
  const serviceTypeQuery = new QueryBuilder(
    ServiceType.find({ isDeleted: false }),
    query,
  )
    .search(serviceTypeSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await serviceTypeQuery.countTotal();
  const result = await serviceTypeQuery.modelQuery;

  return { meta, result };
};

const getServiceTypeByIdFromDB = async (id: string) => {
  const result = await ServiceType.findById(id);

  if (!result) {
    throw new AppError(404, 'This service type not found');
  }

  if (result.isDeleted === true) {
    throw new AppError(400, 'This service type has been deleted');
  }

  return result;
};

const updateServiceTypeIntoDB = async (
  id: string,
  payload: Partial<TServiceType>,
) => {
  const isServiceTypeExists = await ServiceType.findById(id);

  if (!isServiceTypeExists) {
    throw new AppError(404, 'This service type not exists');
  }

  if (isServiceTypeExists.isDeleted === true) {
    throw new AppError(400, 'This service type has been deleted');
  }

  const updatedServiceType = await ServiceType.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedServiceType) {
    throw new AppError(400, 'Service type update failed');
  }

  return updatedServiceType;
};

const deleteServiceTypeFromDB = async (id: string) => {
  const isServiceTypeExists = await ServiceType.findById(id);

  if (!isServiceTypeExists) {
    throw new AppError(404, 'Service type not found');
  }

  const result = await ServiceType.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(400, 'Failed to delete service type');
  }

  return result;
};

export const ServiceTypeServices = {
  createServiceTypeIntoDB,
  getAllServiceTypeFromDB,
  getServiceTypeByIdFromDB,
  updateServiceTypeIntoDB,
  deleteServiceTypeFromDB,
};
