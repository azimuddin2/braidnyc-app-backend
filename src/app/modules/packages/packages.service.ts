import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { UploadedFiles } from '../../interface/common.interface';
import {
  deleteManyFromS3,
  uploadManyToS3,
} from '../../utils/awsS3FileUploader';
import { packageSearchableFields } from './packages.constant';
import { TPackages } from './packages.interface';
import { Packages } from './packages.model';

const createPackagesIntoDB = async (payload: TPackages, files: any) => {
  // Handle image upload to S3
  if (files) {
    const { images } = files as UploadedFiles;

    if (images?.length) {
      const imgsArray = images.map((image) => ({
        file: image,
        path: `images/service`,
      }));

      try {
        payload.images = await uploadManyToS3(imgsArray); // Await all uploads before proceeding
      } catch (error) {
        throw new AppError(500, 'Image upload failed');
      }
    }
  }

  const result = await Packages.create(payload);
  if (!result) {
    throw new AppError(400, 'Failed to create service');
  }

  return result;
};

const getAllPackagesFromDB = async (query: Record<string, unknown>) => {
  const baseQuery = { ...query, isDeleted: false };

  const queryBuilder = new QueryBuilder(
    Packages.find().populate('user'),
    baseQuery,
  )
    .search(packageSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  // Apply merged filters to the query only once
  queryBuilder.modelQuery = queryBuilder.modelQuery.find(
    queryBuilder.finalFilter,
  );

  const meta = await queryBuilder.countTotal();
  const result = await queryBuilder.modelQuery;

  return { meta, result };
};

const getPackagesByIdFromDB = async (id: string) => {
  const result = await Packages.findById(id).populate('user');

  if (!result) {
    throw new AppError(404, 'This service not found');
  }

  return result;
};

const updatePackagesIntoDB = async (
  id: string,
  payload: Partial<TPackages>,
  files: any,
) => {
  const isPackagesExists = await Packages.findById(id);

  if (!isPackagesExists) {
    throw new AppError(404, 'This service is not found');
  }

  const { deleteKey, ...updateData } = payload; // color isn't used, so removed it

  // Handle image upload to S3
  if (files) {
    const { images } = files as UploadedFiles;

    if (images?.length) {
      const imgsArray = images.map((image) => ({
        file: image,
        path: `images/service`,
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
    const newKey = deleteKey.map((key: any) => `images/service/${key}`);

    if (newKey.length > 0) {
      await deleteManyFromS3(newKey); // Delete images from S3
      // Remove deleted images from the product
      await Packages.findByIdAndUpdate(
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
      await Packages.findByIdAndUpdate(
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
    const result = await Packages.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!result) {
      throw new AppError(400, 'Service update failed');
    }

    return result;
  } catch (error: any) {
    console.log(error);
    throw new AppError(500, 'Service update failed');
  }
};

const deletePackagesFromDB = async (id: string) => {
  const isPackagesExists = await Packages.findById(id);

  if (!isPackagesExists) {
    throw new AppError(404, 'This service is not found');
  }

  const result = await Packages.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(400, 'Failed to delete service');
  }

  return result;
};

const updatePackagesStatusIntoDB = async (
  id: string,
  payload: { status: string },
) => {
  const isPackagesExists = await Packages.findById(id);

  if (!isPackagesExists) {
    throw new AppError(404, 'This service is not found');
  }

  const result = await Packages.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const updatePackagesHighlightStatusIntoDB = async (
  id: string,
  payload: { highlightStatus: string },
) => {
  const isPackagesExists = await Packages.findById(id);

  if (!isPackagesExists) {
    throw new AppError(404, 'This service is not found');
  }

  const result = await Packages.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

export const PackagesServices = {
  createPackagesIntoDB,
  getAllPackagesFromDB,
  getPackagesByIdFromDB,
  updatePackagesIntoDB,
  deletePackagesFromDB,
  updatePackagesStatusIntoDB,
  updatePackagesHighlightStatusIntoDB,
};
