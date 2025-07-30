import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { UploadedFiles } from '../../interface/common.interface';
import {
  deleteManyFromS3,
  uploadManyToS3,
} from '../../utils/awsS3FileUploader';
import { productSearchableFields } from './product.constant';
import { TProduct } from './product.interface';
import { Product } from './product.model';

const createProductIntoDB = async (payload: TProduct, files: any) => {
  // Handle image upload to S3
  if (files) {
    const { images } = files as UploadedFiles;

    if (images?.length) {
      const imgsArray = images.map((image) => ({
        file: image,
        path: `images/product`,
      }));

      try {
        payload.images = await uploadManyToS3(imgsArray); // Await all uploads before proceeding
      } catch (error) {
        throw new AppError(500, 'Image upload failed');
      }
    }
  }

  const result = await Product.create(payload);
  if (!result) {
    throw new AppError(400, 'Failed to create products');
  }
  return result;
};

const getAllProductFromDB = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(Product.find(), query)
    .search(productSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await productQuery.countTotal();
  const result = await productQuery.modelQuery;

  return { meta, result };
};

const getProductByIdFromDB = async (id: string) => {
  const result = await Product.findById(id);

  if (!result) {
    throw new AppError(404, 'This service not found');
  }

  return result;
};

const updateProductIntoDB = async (
  id: string,
  payload: Partial<TProduct>,
  files: any,
) => {
  const { deleteKey, ...updateData } = payload; // color isn't used, so removed it

  // Handle image upload to S3
  if (files) {
    const { images } = files as UploadedFiles;

    if (images?.length) {
      const imgsArray = images.map((image) => ({
        file: image,
        path: `images/product`,
      }));

      try {
        payload.images = await uploadManyToS3(imgsArray); // Await all uploads before proceeding
      } catch (error) {
        throw new AppError(500, 'Image upload failed');
      }
    }
  }

  // Handle image deletions (if any)
  if (deleteKey && deleteKey.length > 0) {
    const newKey = deleteKey.map((key: any) => `images/product/${key}`);

    if (newKey.length > 0) {
      await deleteManyFromS3(newKey); // Delete images from S3
      // Remove deleted images from the product
      await Product.findByIdAndUpdate(
        id,
        {
          $pull: { images: { key: { $in: deleteKey } } },
        },
        { new: true },
      );
    }
  }

  // If new images are provided, push them to the product
  if (payload?.images && payload.images.length > 0) {
    try {
      await Product.findByIdAndUpdate(
        id,
        { $addToSet: { images: { $each: payload.images } } }, // Push new images to the product
        { new: true },
      );
      delete payload.images; // Remove images from the payload after pushing
    } catch (error) {
      throw new AppError(400, 'Failed to update images');
    }
  }

  // Update other product details
  try {
    const result = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!result) {
      throw new AppError(400, 'Product update failed');
    }

    return result;
  } catch (error: any) {
    console.log(error);
    throw new AppError(500, 'Product update failed');
  }
};

const deleteProductFromDB = async (id: string) => {
  const isProductExists = await Product.findById(id);

  if (!isProductExists) {
    throw new AppError(404, 'This product is not found');
  }

  const result = await Product.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(400, 'Failed to delete product');
  }

  return result;
};

export const ProductServices = {
  createProductIntoDB,
  getAllProductFromDB,
  getProductByIdFromDB,
  updateProductIntoDB,
  deleteProductFromDB,
};
