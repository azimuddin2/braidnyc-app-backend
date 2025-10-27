import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TOwnerRegistration } from './ownerRegistration.interface';
import { uploadToS3 } from '../../utils/awsS3FileUploader';
import { OwnerRegistration } from './ownerRegistration.model';

const createOwnerRegistrationIntoDB = async (
  userId: string,
  data: TOwnerRegistration,
  files?: {
    idDocument?: Express.Multer.File[];
    businessRegistration?: Express.Multer.File[];
    salonFrontPhoto?: Express.Multer.File[];
    salonInsidePhoto?: Express.Multer.File[];
  },
) => {
  const user = await User.findById(userId).select(
    'status isDeleted isRegistration',
  );
  if (!user) {
    throw new AppError(404, 'User not found');
  } else if (user.isDeleted) {
    throw new AppError(403, 'User is deleted');
  } else if (user.status === 'blocked') {
    throw new AppError(403, 'User is blocked');
  }

  // 🛑 Check if user already registered
  if (user.isRegistration) {
    throw new AppError(400, 'You have already completed your registration');
  }

  // ✅ Optional: double-check if an owner registration record already exists
  const existingRegistration = await OwnerRegistration.findOne({
    user: user._id,
  });
  if (existingRegistration) {
    throw new AppError(400, 'Owner registration already exists for this user');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const payload: Partial<TOwnerRegistration> = {
      user: user._id,
      salonName: data.salonName,
      about: data.about,
      openingHours: data.openingHours,
    };

    // 📸 Handle uploads
    if (files) {
      const uploadSingleFile = async (
        fileArray: Express.Multer.File[] | undefined,
        folder: string,
      ): Promise<string | undefined> => {
        if (fileArray && fileArray[0]) {
          const file = fileArray[0];
          const uploadedUrl = await uploadToS3({
            file,
            fileName: `images/owner/${folder}/${Date.now()}-${Math.floor(
              1000 + Math.random() * 9000,
            )}`,
          });
          return uploadedUrl as string;
        }
        return undefined;
      };

      payload.idDocument = await uploadSingleFile(
        files.idDocument,
        'idDocument',
      );
      payload.businessRegistration = await uploadSingleFile(
        files.businessRegistration,
        'businessReg',
      );
      payload.salonFrontPhoto = await uploadSingleFile(
        files.salonFrontPhoto,
        'salonFront',
      );
      payload.salonInsidePhoto = await uploadSingleFile(
        files.salonInsidePhoto,
        'salonInside',
      );
    }

    const created = await OwnerRegistration.create([payload], { session });
    if (!created || created.length === 0) {
      throw new AppError(400, 'Failed to create owner registration');
    }

    await User.findByIdAndUpdate(
      user._id,
      { isRegistration: true },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return created[0];
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(500, error.message || 'Owner registration failed');
  }
};

export const OwnerRegistrationService = {
  createOwnerRegistrationIntoDB,
};
