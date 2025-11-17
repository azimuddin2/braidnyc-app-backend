import slugify from 'slugify';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { deleteFromS3, uploadToS3 } from '../../utils/awsS3FileUploader';
import { TCategory } from './category.interface';
import { Category } from './category.model';
import { categorySearchableFields } from './category.constant';

const createCategoryIntoDB = async (payload: TCategory, file: any) => {
  // 1. Check if category exists but ignore soft deleted
  const isCategoryExists = await Category.findOne({
    name: payload.name,
    isDeleted: false,
  });

  if (isCategoryExists) {
    throw new AppError(400, 'This category already exists');
  }

  // 2. Auto slug
  if (payload.name) {
    payload.slug = slugify(payload.name, { lower: true, strict: true });
  }

  // 3. Upload image
  if (file) {
    const uploadedUrl = await uploadToS3({
      file,
      fileName: `images/category/${Math.floor(100000 + Math.random() * 900000)}`,
    });
    payload.image = uploadedUrl;
  }

  // 4. Create category
  const result = await Category.create(payload);
  if (!result) {
    throw new AppError(400, 'Failed to create category');
  }

  return result;
};

const getAllCategoryFromDB = async (query: Record<string, unknown>) => {
  const categoryQuery = new QueryBuilder(
    Category.find({ isDeleted: false }).populate('subcategories'),
    query,
  )
    .search(categorySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await categoryQuery.countTotal();
  const result = await categoryQuery.modelQuery;

  return { meta, result };
};

const getCategoryByIdFromDB = async (id: string) => {
  const result = await Category.findById(id).populate('Subcategory');

  if (!result) {
    throw new AppError(404, 'This category not found');
  }

  if (result.isDeleted) {
    throw new AppError(400, 'This category has been deleted');
  }

  return result;
};

const updateCategoryIntoDB = async (
  id: string,
  payload: Partial<TCategory>,
  file?: Express.Multer.File,
) => {
  const isCategoryExists = await Category.findById(id);

  if (!isCategoryExists) {
    throw new AppError(404, 'This category not exists');
  }

  if (isCategoryExists.isDeleted) {
    throw new AppError(400, 'This category has been deleted');
  }

  // Auto slug update
  if (payload.name) {
    payload.slug = slugify(payload.name, { lower: true, strict: true });
  }

  try {
    // If new image is passed
    if (file) {
      const uploadedUrl = await uploadToS3({
        file,
        fileName: `images/category/${Math.floor(100000 + Math.random() * 900000)}`,
      });

      // Delete previous
      if (isCategoryExists.image) {
        await deleteFromS3(isCategoryExists.image);
      }

      payload.image = uploadedUrl;
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updatedCategory) {
      throw new AppError(400, 'Category update failed');
    }

    return updatedCategory;
  } catch (error: any) {
    console.error('updateCategoryIntoDB Error:', error);
    throw new AppError(500, 'Failed to update category');
  }
};

const deleteCategoryFromDB = async (id: string) => {
  const isCategoryExists = await Category.findById(id);

  if (!isCategoryExists) {
    throw new AppError(404, 'Category not found');
  }

  if (isCategoryExists.isDeleted) {
    throw new AppError(400, 'Category is already deleted');
  }

  const result = await Category.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!result) {
    throw new AppError(400, 'Failed to delete category');
  }

  return result;
};

export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategoryFromDB,
  getCategoryByIdFromDB,
  updateCategoryIntoDB,
  deleteCategoryFromDB,
};
