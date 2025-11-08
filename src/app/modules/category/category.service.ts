import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { productTypeSearchableFields } from './category.constant';
import { TProductType } from './category.interface';
import { ProductType } from './category.model';

const createProductTypeIntoDB = async (payload: TProductType) => {
  const filter = { name: payload.name };

  const isProductTypeExists = await ProductType.findOne(filter);

  if (isProductTypeExists) {
    throw new AppError(404, 'This product type already exists');
  }

  const result = await ProductType.create(payload);
  if (!result) {
    throw new AppError(400, 'Failed to create product type');
  }
  return result;
};

const getAllProductTypeFromDB = async (query: Record<string, unknown>) => {
  const productTypeQuery = new QueryBuilder(
    ProductType.find({ isDeleted: false }),
    query,
  )
    .search(productTypeSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await productTypeQuery.countTotal();
  const result = await productTypeQuery.modelQuery;

  return { meta, result };
};

const getProductTypeByIdFromDB = async (id: string) => {
  const result = await ProductType.findById(id);

  if (!result) {
    throw new AppError(404, 'This product type not found');
  }

  if (result.isDeleted === true) {
    throw new AppError(400, 'This product type has been deleted');
  }

  return result;
};

const updateProductTypeIntoDB = async (
  id: string,
  payload: Partial<TProductType>,
) => {
  const isProductTypeExists = await ProductType.findById(id);

  if (!isProductTypeExists) {
    throw new AppError(404, 'This product type not exists');
  }

  if (isProductTypeExists.isDeleted === true) {
    throw new AppError(400, 'This product type has been deleted');
  }

  const updatedProductType = await ProductType.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedProductType) {
    throw new AppError(400, 'Product type update failed');
  }

  return updatedProductType;
};

const deleteProductTypeFromDB = async (id: string) => {
  const isProductTypeExists = await ProductType.findById(id);

  if (!isProductTypeExists) {
    throw new AppError(404, 'Product type not found');
  }

  const result = await ProductType.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(400, 'Failed to delete product type');
  }

  return result;
};

export const ProductTypeServices = {
  createProductTypeIntoDB,
  getAllProductTypeFromDB,
  getProductTypeByIdFromDB,
  updateProductTypeIntoDB,
  deleteProductTypeFromDB,
};
