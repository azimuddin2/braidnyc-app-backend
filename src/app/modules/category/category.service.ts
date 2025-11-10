import slugify from 'slugify';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { deleteFromS3, uploadToS3 } from '../../utils/awsS3FileUploader';
import { TCategory } from './category.interface';
import { Category } from './category.model';
import { categorySearchableFields } from './category.constant';

const createCategoryIntoDB = async (payload: TCategory, file: any) => {
  // 🔹 1. Check if category already exists
  const isCategoryExists = await Category.findOne({ name: payload.name });
  if (isCategoryExists) {
    throw new AppError(400, 'This category already exists');
  }

  // 🔹 2. Auto generate slug from name
  if (payload.name) {
    payload.slug = slugify(payload.name, { lower: true, strict: true });
  }

  // 🔹 3. Handle image upload to S3
  if (file) {
    const uploadedUrl = await uploadToS3({
      file,
      fileName: `images/category/${Math.floor(100000 + Math.random() * 900000)}`,
    });
    payload.image = uploadedUrl;
  }

  // 🔹 4. Create new category
  const result = await Category.create(payload);
  if (!result) {
    throw new AppError(400, 'Failed to create category');
  }

  return result;
};

const getAllCategoryFromDB = async (query: Record<string, unknown>) => {
  const categoryQuery = new QueryBuilder(
    Category.find({ isDeleted: false }),
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
  const result = await Category.findById(id);

  if (!result) {
    throw new AppError(404, 'This category not found');
  }

  if (result.isDeleted === true) {
    throw new AppError(400, 'This category has been deleted');
  }

  return result;
};

const updateCategoryIntoDB = async (
  id: string,
  payload: Partial<TCategory>,
  file?: Express.Multer.File,
) => {
  // 🔍 Step 1: Check if the category exists
  const isCategoryExists = await Category.findById(id);

  if (!isCategoryExists) {
    throw new AppError(404, 'This category not exists');
  }

  if (isCategoryExists.isDeleted === true) {
    throw new AppError(400, 'This category has been deleted');
  }

  // 🔹 2. Auto generate slug from name
  if (payload.name) {
    payload.slug = slugify(payload.name, { lower: true, strict: true });
  }

  try {
    // 📸 Step 2: Handle new image upload
    if (file) {
      const uploadedUrl = await uploadToS3({
        file,
        fileName: `images/category/${Math.floor(100000 + Math.random() * 900000)}`,
      });

      // 🧹 Step 3: Delete the previous image from S3 (if exists)
      if (isCategoryExists.image) {
        await deleteFromS3(isCategoryExists.image);
      }

      // 📝 Step 4: Set the new image URL to payload
      payload.image = uploadedUrl;
    }

    // 🔄 Step 5: Update the category in the database
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
