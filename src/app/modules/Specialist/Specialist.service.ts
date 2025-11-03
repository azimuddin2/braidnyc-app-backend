import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { deleteFromS3, uploadToS3 } from '../../utils/awsS3FileUploader';
import { TSpecialist } from './Specialist.interface';
import { Specialist } from './Specialist.model';
import { User } from '../user/user.model';
import { SpecialistSearchableFields } from './Specialist.constant';

const createSpecialistIntoDB = async (
  userId: string,
  payload: TSpecialist,
  file: any,
) => {
  const user = await User.findById(userId).select('role isRegistration');
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  if (user.role !== 'owner') {
    throw new AppError(403, 'Only owner can perform this action');
  }

  if (user.isRegistration === false) {
    throw new AppError(400, 'Owner registration not completed');
  }

  // 📸 Handle single image upload to S3
  if (file) {
    const uploadedUrl = await uploadToS3({
      file,
      fileName: `images/specialist/${Math.floor(100000 + Math.random() * 900000)}`,
    });

    payload.image = uploadedUrl; // Assign only the to payload.image
  }

  // ✅ Set the user field before saving
  payload.user = userId as any;

  // 🧑‍💼 Create the Specialist
  const result = await Specialist.create(payload);
  if (!result) {
    throw new AppError(400, 'Failed to create specialist member');
  }

  return result;
};

const getAllSpecialistFromDB = async (query: Record<string, unknown>) => {
  const { user, ...filters } = query;

  if (!user || !mongoose.Types.ObjectId.isValid(user as string)) {
    throw new AppError(400, 'Invalid User ID');
  }

  // Base query -> always exclude deleted packages service
  let specialistQuery = Specialist.find({ user, isDeleted: false });

  const queryBuilder = new QueryBuilder(specialistQuery, filters)
    .search(SpecialistSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await queryBuilder.countTotal();
  const result = await queryBuilder.modelQuery;

  return { meta, result };
};

const getSpecialistByIdFromDB = async (id: string) => {
  const result = await Specialist.findById(id);

  if (!result) {
    throw new AppError(404, 'This specialist member not found');
  }

  return result;
};

const updateSpecialistIntoDB = async (
  userId: string,
  id: string,
  payload: Partial<TSpecialist>,
  file?: Express.Multer.File,
) => {
  // 🔍 Step 0: Check if the user exists
  const user = await User.findById(userId).select('role isRegistration');
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  if (user.role !== 'owner') {
    throw new AppError(403, 'Only owner can perform this action');
  }

  if (user.isRegistration === false) {
    throw new AppError(400, 'Owner registration not completed');
  }

  // 🔍 Step 1: Check if the specialist member exists
  const existingSpecialist = await Specialist.findById(id);
  if (!existingSpecialist) {
    throw new AppError(404, 'Specialist not found');
  }

  try {
    // 📸 Step 2: Handle new image upload
    if (file) {
      const uploadedUrl = await uploadToS3({
        file,
        fileName: `images/specialist/${Math.floor(100000 + Math.random() * 900000)}`,
      });

      // 🧹 Step 3: Delete the previous image from S3 (if exists)
      if (existingSpecialist.image) {
        await deleteFromS3(existingSpecialist.image);
      }

      // 📝 Step 4: Set the new image URL to payload
      payload.image = uploadedUrl;
    }

    // 🔄 Step 5: Update the specialist member in the database
    const updatedSpecialist = await Specialist.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updatedSpecialist) {
      throw new AppError(400, 'Specialist update failed');
    }

    return updatedSpecialist;
  } catch (error: any) {
    console.error('updateSpecialistIntoDB Error:', error);
    throw new AppError(500, 'Failed to update specialist');
  }
};

const deleteSpecialistFromDB = async (id: string) => {
  const isSpecialistExists = await Specialist.findById(id);

  if (!isSpecialistExists) {
    throw new AppError(404, 'Specialist not found');
  }

  const result = await Specialist.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(400, 'Failed to delete Specialist');
  }

  return result;
};

export const SpecialistServices = {
  createSpecialistIntoDB,
  getAllSpecialistFromDB,
  getSpecialistByIdFromDB,
  updateSpecialistIntoDB,
  deleteSpecialistFromDB,
};
