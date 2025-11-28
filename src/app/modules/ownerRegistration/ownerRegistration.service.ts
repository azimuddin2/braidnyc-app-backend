import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TOwnerRegistration } from './ownerRegistration.interface';
import { deleteFromS3, uploadToS3 } from '../../utils/awsS3FileUploader';
import { OwnerRegistration } from './ownerRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { OwnerSearchableFields } from './ownerRegistration.constant';
import { OwnerService } from '../ownerService/ownerService.model';

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
      ...data,
      user: user._id,
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

    const ownerRegId = created[0]._id;

    await User.findByIdAndUpdate(
      user._id,
      {
        isRegistration: true,
        ownerReg: ownerRegId,
        ...(data.location && {
          location: {
            type: 'Point',
            coordinates: data.location.coordinates,
            streetAddress: data.location.streetAddress,
          },
        }),
      },
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

const getAllOwnerRegistrationFromDB = async (
  query: Record<string, unknown>,
) => {
  const baseQuery: Record<string, any> = { isDeleted: false };

  // ⭐ Single subcategory filter
  if (query.subcategory) {
    const services = await OwnerService.find({
      subcategory: query.subcategory,
      isDeleted: false,
    }).select('_id');

    const serviceIds = services.map((s) => s._id);

    // Apply filter even if serviceIds is empty
    baseQuery.services = { $in: serviceIds };

    // Remove from query to avoid conflicts with QueryBuilder.filter()
    delete query.subcategory;
  }

  // 🔹 Use QueryBuilder exactly like before
  const ownerRegistrationQuery = new QueryBuilder(
    OwnerRegistration.find(baseQuery)
      .populate({
        path: 'user',
        select: '-password -needsPasswordChange',
      })
      .populate({
        path: 'services',
        match: baseQuery.services
          ? { _id: { $in: baseQuery.services.$in } }
          : {},
      }),
    query,
  )
    .search(OwnerSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await ownerRegistrationQuery.countTotal();
  const result = await ownerRegistrationQuery.modelQuery;

  return { meta, result };
};

const getOwnerRegistrationByIdFromDB = async (id: string) => {
  const result = await OwnerRegistration.findById(id).populate({
    path: 'user',
    select: '-password -needsPasswordChange',
  });

  if (!result) {
    throw new AppError(404, 'This owner not found');
  }

  return result;
};

const getOwnerProfileFromDB = async (userId: string) => {
  const user = await User.findById(userId).select('role isRegistration');
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  console.log(userId);

  if (user.role !== 'owner') {
    throw new AppError(403, 'Only owner can perform this access');
  }

  if (user.isRegistration === false) {
    throw new AppError(400, 'Owner registration not completed');
  }

  const result = await OwnerRegistration.findOne({ user: user._id }).populate({
    path: 'user',
    select: '-password -needsPasswordChange',
  });

  if (!result) {
    throw new AppError(404, 'This owner not found');
  }

  return result;
};

const updateOwnerRegistrationIntoDB = async (
  userId: string,
  id: string,
  payload: Partial<TOwnerRegistration>,
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

  // 🔍 Step 1: Check existing owner
  const existingOwner = await OwnerRegistration.findById(id);
  if (!existingOwner) {
    throw new AppError(404, 'Owner not found');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 📸 Step 2: Handle new image upload
    if (file) {
      const uploadedUrl = await uploadToS3({
        file,
        fileName: `images/salon/${Math.floor(100000 + Math.random() * 900000)}`,
      });

      // 🧹 Delete previous image
      if (existingOwner.salonPhoto) {
        await deleteFromS3(existingOwner.salonPhoto);
      }

      payload.salonPhoto = uploadedUrl;
    }

    // 🔄 Step 3: Update owner registration
    const updatedOwner = await OwnerRegistration.findByIdAndUpdate(
      id,
      payload,
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!updatedOwner) {
      throw new AppError(400, 'Owner update failed');
    }

    // 📍 Step 4: Update user location
    if (payload.location) {
      await User.findByIdAndUpdate(
        userId,
        {
          location: {
            type: 'Point',
            coordinates: payload.location.coordinates,
            streetAddress: payload.location.streetAddress,
          },
        },
        { runValidators: true, session },
      );
    }

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return updatedOwner;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(500, error.message || 'Failed to update owner');
  }
};

export const OwnerRegistrationService = {
  createOwnerRegistrationIntoDB,
  getAllOwnerRegistrationFromDB,
  getOwnerRegistrationByIdFromDB,
  getOwnerProfileFromDB,
  updateOwnerRegistrationIntoDB,
};
