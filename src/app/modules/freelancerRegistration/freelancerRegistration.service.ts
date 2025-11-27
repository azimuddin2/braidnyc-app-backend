import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { deleteFromS3, uploadToS3 } from '../../utils/awsS3FileUploader';
import { TFreelancerRegistration } from './freelancerRegistration.interface';
import { FreelancerRegistration } from './freelancerRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { FreelancerSearchableFields } from './freelancerRegistration.constant';
import { FreelancerService } from '../freelancerService/freelancerService.model';

const createFreelancerRegistrationIntoDB = async (
  userId: string,
  data: TFreelancerRegistration,
  files?: {
    profile?: Express.Multer.File[];
    idDocument?: Express.Multer.File[];
    businessRegistration?: Express.Multer.File[];
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
  const existingRegistration = await FreelancerRegistration.findOne({
    user: user._id,
  });
  if (existingRegistration) {
    throw new AppError(
      400,
      'Freelancer registration already exists for this user',
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const payload: Partial<TFreelancerRegistration> = {
      user: user._id,
      experienceYear: data.experienceYear,
      about: data.about,
      openingHours: data.openingHours,
      availability: data.availability,
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
            fileName: `images/freelancer/${folder}/${Date.now()}-${Math.floor(
              1000 + Math.random() * 9000,
            )}`,
          });
          return uploadedUrl as string;
        }
        return undefined;
      };

      payload.profile = await uploadSingleFile(files.profile, 'profile');
      payload.idDocument = await uploadSingleFile(
        files.idDocument,
        'idDocument',
      );
      payload.businessRegistration = await uploadSingleFile(
        files.businessRegistration,
        'businessReg',
      );
    }

    const created = await FreelancerRegistration.create([payload], { session });
    if (!created || created.length === 0) {
      throw new AppError(400, 'Failed to create owner registration');
    }

    await User.findByIdAndUpdate(
      user._id,
      {
        isRegistration: true,
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

const getAllFreelancersFromDB = async (query: Record<string, unknown>) => {
  const baseQuery: Record<string, any> = { isDeleted: false };

  // ⭐ Single subcategory filter — EXACT SAME PATTERN FOLLOWED
  if (query.subcategory) {
    const services = await FreelancerService.find({
      subcategory: query.subcategory,
      isDeleted: false,
    }).select('_id');

    const serviceIds = services.map((s) => s._id);

    // Always apply the filter — even if empty
    baseQuery.services = { $in: serviceIds };

    // Prevent QueryBuilder.filter() conflict
    delete query.subcategory;
  }

  // 🔹 Use QueryBuilder EXACTLY like your old structure
  const ownerRegistrationQuery = new QueryBuilder(
    FreelancerRegistration.find(baseQuery)
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
    .search(FreelancerSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await ownerRegistrationQuery.countTotal();
  const result = await ownerRegistrationQuery.modelQuery;

  return { meta, result };
};

const getFreelancerByIdFromDB = async (id: string) => {
  const result = await FreelancerRegistration.findById(id).populate({
    path: 'user',
    select: '-password -needsPasswordChange',
  });

  if (!result) {
    throw new AppError(404, 'This freelancer not found');
  }

  return result;
};

const getFreelancerProfileFromDB = async (userId: string) => {
  const user = await User.findById(userId).select('role isRegistration');
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  if (user.role !== 'freelancer') {
    throw new AppError(403, 'Only freelancer can perform this access');
  }

  if (user.isRegistration === false) {
    throw new AppError(400, 'Freelancer registration not completed');
  }

  const result = await FreelancerRegistration.findOne({
    user: user._id,
  }).populate({
    path: 'user',
    select: '-password -needsPasswordChange',
  });

  if (!result) {
    throw new AppError(404, 'This freelancer not found');
  }

  return result;
};

const updateFreelancerRegistrationIntoDB = async (
  userId: string,
  id: string,
  payload: Partial<TFreelancerRegistration>,
  files?: {
    profile?: Express.Multer.File[];
    idDocument?: Express.Multer.File[];
    businessRegistration?: Express.Multer.File[];
  },
) => {
  const user = await User.findById(userId).select('role isRegistration');
  if (!user) throw new AppError(404, 'User not found');
  if (user.role !== 'freelancer')
    throw new AppError(403, 'Only freelancer can perform this action');
  if (!user.isRegistration)
    throw new AppError(400, 'Freelancer registration not completed');

  const existingFreelancer = await FreelancerRegistration.findById(id);
  if (!existingFreelancer)
    throw new AppError(404, 'Freelancer registration not found');

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 🔁 File Upload Handler
    const uploadSingleFile = async (
      fileArray: Express.Multer.File[] | undefined,
      folder: string,
    ) => {
      if (fileArray && fileArray[0]) {
        const file = fileArray[0];
        const uploadedUrl = await uploadToS3({
          file,
          fileName: `images/freelancer/${folder}/${Date.now()}-${Math.floor(
            1000 + Math.random() * 9000,
          )}`,
        });
        return uploadedUrl as string;
      }
      return undefined;
    };

    // 📸 Upload Files If Provided
    if (files) {
      if (files.profile) {
        const newProfile = await uploadSingleFile(files.profile, 'profile');

        if (existingFreelancer.profile) {
          await deleteFromS3(existingFreelancer.profile);
        }

        payload.profile = newProfile;
      }

      if (files.idDocument) {
        const newID = await uploadSingleFile(files.idDocument, 'idDocument');

        if (existingFreelancer.idDocument) {
          await deleteFromS3(existingFreelancer.idDocument);
        }

        payload.idDocument = newID;
      }

      if (files.businessRegistration) {
        const newBR = await uploadSingleFile(
          files.businessRegistration,
          'businessReg',
        );

        if (existingFreelancer.businessRegistration) {
          await deleteFromS3(existingFreelancer.businessRegistration);
        }

        payload.businessRegistration = newBR;
      }
    }

    // 🔄 Update Freelancer Registration
    const updatedFreelancer = await FreelancerRegistration.findByIdAndUpdate(
      id,
      payload,
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!updatedFreelancer) throw new AppError(400, 'Freelancer update failed');

    // 🗺️ Update Location If Provided
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
        { new: true, session },
      );
    }

    await session.commitTransaction();
    session.endSession();

    return updatedFreelancer;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      500,
      error.message || 'Failed to update freelancer with transaction',
    );
  }
};

export const FreelancerRegistrationService = {
  createFreelancerRegistrationIntoDB,
  getAllFreelancersFromDB,
  getFreelancerByIdFromDB,
  getFreelancerProfileFromDB,
  updateFreelancerRegistrationIntoDB,
};
