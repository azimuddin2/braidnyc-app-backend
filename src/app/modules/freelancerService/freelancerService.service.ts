import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { deleteFromS3, uploadToS3 } from '../../utils/awsS3FileUploader';
import { User } from '../user/user.model';
import { TFreelancerService } from './freelancerService.interface';
import { FreelancerService } from './freelancerService.model';
import { serviceSearchableFields } from './freelancerService.constant';
import { Category } from '../category/category.model';
import { Subcategory } from '../subcategory/subcategory.model';
import { FreelancerRegistration } from '../freelancerRegistration/freelancerRegistration.model';

const createServiceIntoDB = async (
  userId: string,
  payload: TFreelancerService,
  files?: {
    studioFrontPhoto?: Express.Multer.File[];
    studioInsidePhoto?: Express.Multer.File[];
  },
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1️⃣ Validate user (same as before)
    const user = await User.findById(userId)
      .select('role isRegistration')
      .session(session);

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    if (user.role !== 'freelancer') {
      throw new AppError(403, 'Only freelancers can perform this action');
    }

    if (user.isRegistration === false) {
      throw new AppError(400, 'Freelancer registration not completed');
    }

    // 2️⃣ Validate category + subcategory
    const category = await Category.findOne({ name: payload.category }).session(
      session,
    );
    if (!category) throw new AppError(404, 'Category not found');

    const subcategory = await Subcategory.findOne({
      name: payload.subcategory,
    }).session(session);
    if (!subcategory) throw new AppError(404, 'Subcategory not found');

    // 3️⃣ Handle image uploads
    if (files) {
      const uploadSingleFile = async (
        fileArray: Express.Multer.File[] | undefined,
        folder: string,
      ): Promise<string | null> => {
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
        return null;
      };

      payload.studioFrontPhoto =
        (await uploadSingleFile(files.studioFrontPhoto, 'frontPhoto')) ?? null;

      payload.studioInsidePhoto =
        (await uploadSingleFile(files.studioInsidePhoto, 'insidePhoto')) ??
        null;
    }

    // 4️⃣ Attach freelancer ID
    payload.freelancer = userId as any;

    // 5️⃣ Create freelancer service
    const service = await FreelancerService.create([payload], { session });

    if (!service || !service[0]) {
      throw new AppError(400, 'Failed to create service');
    }

    const createdService = service[0];

    // 6️⃣ Add service ID into FreelancerRegistration.services[]
    await FreelancerRegistration.findOneAndUpdate(
      { user: userId },
      { $push: { services: createdService._id } },
      { session, new: true },
    );

    // 7️⃣ Commit transaction
    await session.commitTransaction();
    session.endSession();

    return createdService;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllServiceFromDB = async (query: Record<string, unknown>) => {
  const { freelancer, ...filters } = query;

  if (!freelancer || !mongoose.Types.ObjectId.isValid(freelancer as string)) {
    throw new AppError(400, 'Invalid Freelancer ID');
  }

  // Base query -> always exclude deleted packages service
  let serviceQuery = FreelancerService.find({ freelancer, isDeleted: false });

  const queryBuilder = new QueryBuilder(serviceQuery, filters)
    .search(serviceSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await queryBuilder.countTotal();
  const result = await queryBuilder.modelQuery;

  return { meta, result };
};

const getServiceByIdFromDB = async (id: string) => {
  const result = await FreelancerService.findById(id).populate({
    path: 'freelancer',
    select: '-password -needsPasswordChange',
  });

  if (!result) {
    throw new AppError(404, 'This service not found');
  }

  return result;
};

const updateServiceIntoDB = async (
  userId: string,
  id: string,
  payload: Partial<TFreelancerService>,
  files?: {
    studioFrontPhoto?: Express.Multer.File[];
    studioInsidePhoto?: Express.Multer.File[];
  },
) => {
  // 1️⃣ Validate user existence and role
  const user = await User.findById(userId).select('role isRegistration');
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  if (user.role !== 'freelancer') {
    throw new AppError(403, 'Only freelancers can perform this action');
  }

  if (user.isRegistration === false) {
    throw new AppError(400, 'Freelancer registration not completed');
  }

  // 2️⃣ Validate service existence
  const existingService = await FreelancerService.findById(id);
  if (!existingService) {
    throw new AppError(404, 'Service not found');
  }

  // 3️⃣ Handle image uploads (same as create)
  if (files) {
    const uploadSingleFile = async (
      fileArray: Express.Multer.File[] | undefined,
      folder: string,
    ): Promise<string | null> => {
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
      return null;
    };

    // Optional: Delete old S3 photos if new ones uploaded
    if (files.studioFrontPhoto && existingService.studioFrontPhoto) {
      await deleteFromS3(existingService.studioFrontPhoto);
    }
    if (files.studioInsidePhoto && existingService.studioInsidePhoto) {
      await deleteFromS3(existingService.studioInsidePhoto);
    }

    // Upload new ones
    const newFrontPhoto =
      (await uploadSingleFile(files.studioFrontPhoto, 'frontPhoto')) ?? null;
    const newInsidePhoto =
      (await uploadSingleFile(files.studioInsidePhoto, 'insidePhoto')) ?? null;

    if (newFrontPhoto) payload.studioFrontPhoto = newFrontPhoto;
    if (newInsidePhoto) payload.studioInsidePhoto = newInsidePhoto;
  }

  // 4️⃣ Update service details
  const updatedService = await FreelancerService.findByIdAndUpdate(
    id,
    payload,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedService) {
    throw new AppError(400, 'Failed to update freelancer service');
  }

  // 5️⃣ Return updated result
  return updatedService;
};

const deleteServiceFromDB = async (id: string) => {
  const isServiceExists = await FreelancerService.findById(id);

  if (!isServiceExists) {
    throw new AppError(404, 'This service is not found');
  }

  const result = await FreelancerService.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(400, 'Failed to delete service');
  }

  return result;
};

// const getAvailabilityFromDB = async (
//     query: Record<string, unknown>,
// ): Promise<TServiceSlots[]> => {
//     // 1️⃣ Extract serviceId and date from query
//     const { serviceId, date } = query as { serviceId: string; date: string };
//     if (!serviceId || !date) throw new AppError(400, 'Missing serviceId or date');

//     // 2️⃣ Fetch the service from DB by serviceId
//     const service = await Packages.findOne({ serviceId }).lean();
//     if (!service) throw new AppError(404, 'Service not found');

//     // 3️⃣ Determine day of the week for the given date (e.g., "monday")
//     const selectedDate = new Date(date);
//     const dayOfWeek = selectedDate
//         .toLocaleDateString('en-US', { weekday: 'long' })
//         .toLowerCase();

//     // 4️⃣ Get the weekly schedule for that day
//     const weeklySchedule = service.availability?.weeklySchedule || {};
//     const schedule = weeklySchedule[dayOfWeek as keyof typeof weeklySchedule];

//     // 5️⃣ If the service is not enabled on this day, return empty array
//     if (!schedule?.enabled) return [];

//     const result: TServiceSlots[] = [];

//     // 6️⃣ Loop through each saved service (different durations/prices)
//     for (const savedService of service.savedServices) {
//         // 6a️⃣ Convert duration to minutes
//         let slotDuration = 60;
//         if (savedService.duration.includes('hr'))
//             slotDuration = parseFloat(savedService.duration) * 60;
//         else if (savedService.duration.includes('min'))
//             slotDuration = parseInt(savedService.duration, 10);

//         // 6b️⃣ Generate all possible slots for the day based on start/end times and duration
//         const slots = generateTimeSlots(
//             schedule.startTime,
//             schedule.endTime,
//             slotDuration,
//         );

//         // 6c️⃣ Fetch all bookings for this serviceItemId on the selected date
//         const bookedTimesAgg = await Booking.aggregate([
//             { $match: { serviceId, date, serviceItemId: savedService.id } },
//             { $project: { time: 1, _id: 0 } },
//         ]);

//         // 6d️⃣ Create a Set of booked slot times for quick lookup
//         const bookedTimesSet = new Set(bookedTimesAgg.map((b: any) => b.time));

//         // 6e️⃣ Mark slots as 'booked' or 'available'
//         const slotsWithStatus: TSlot[] = slots.map((slot) => ({
//             ...slot,
//             status: bookedTimesSet.has(slot.time) ? 'booked' : 'available',
//         }));

//         // 6f️⃣ Push the processed service with slots into result
//         result.push({
//             serviceItemId: savedService.id,
//             name: service.name,
//             duration: savedService.duration,
//             finalPrice: savedService.finalPrice,
//             slots: slotsWithStatus,
//         });
//     }

//     // 7️⃣ Return all services with their slots and statuses
//     return result;
// };

export const FreelancerServiceServices = {
  createServiceIntoDB,
  getAllServiceFromDB,
  getServiceByIdFromDB,
  updateServiceIntoDB,
  deleteServiceFromDB,
};
