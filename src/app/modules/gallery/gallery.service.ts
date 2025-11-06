import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { UploadedFiles } from '../../interface/common.interface';
import {
  deleteManyFromS3,
  uploadManyToS3,
} from '../../utils/awsS3FileUploader';
import { User } from '../user/user.model';
import { TGallery } from './gallery.interface';
import { Gallery } from './gallery.model';

const createGalleryIntoDB = async (userId: string, files: any) => {
  // Validate user
  const user = await User.findById(userId).select('role isRegistration');
  if (!user) throw new AppError(404, 'User not found');

  if (!['owner', 'freelancer'].includes(user.role)) {
    throw new AppError(403, 'Only owner or freelancer can create gallery');
  }

  if (user.isRegistration === false) {
    throw new AppError(400, 'Registration not completed');
  }

  // Strict image check
  if (!files || !Array.isArray(files.images) || files.images.length === 0) {
    throw new AppError(400, 'At least one image is required');
  }

  // Upload images to S3
  const imgsArray = files.images.map((image: any) => ({
    file: image,
    path: `images/gallery`,
  }));

  let uploadedImages: any[] = [];
  try {
    uploadedImages = await uploadManyToS3(imgsArray);
  } catch (error) {
    throw new AppError(500, 'Image upload failed');
  }

  // Check if user already has a gallery
  const existingGallery = await Gallery.findOne({ user: userId });

  if (existingGallery) {
    // ✅ Add new images to existing gallery
    existingGallery.images.push(...uploadedImages);
    existingGallery.deleteKey.push(...uploadedImages.map((img) => img.key));

    await existingGallery.save();
    return existingGallery;
  } else {
    // ✅ Create a new gallery
    const payload: Partial<TGallery> = {
      user: userId as any,
      images: uploadedImages,
      deleteKey: uploadedImages.map((img) => img.key),
    };

    const result = await Gallery.create(payload);
    if (!result) throw new AppError(400, 'Failed to create gallery');
    return result;
  }
};

const getGalleryFromDB = async (query: Record<string, unknown>) => {
  const { user } = query;

  if (!user || !mongoose.Types.ObjectId.isValid(user as string)) {
    throw new AppError(400, 'Invalid User ID');
  }

  const filter = { user: user as string, isDeleted: false };

  const result = await Gallery.find(filter);

  if (!result || result.length === 0) {
    throw new AppError(404, 'Gallery not found');
  }

  return result;
};

// const updateServiceIntoDB = async (
//     userId: string,
//     id: string,
//     payload: Partial<TOwnerService>,
//     files: any,
// ) => {
//     const user = await User.findById(userId).select('role isRegistration');
//     if (!user) {
//         throw new AppError(404, 'User not found');
//     }

//     if (user.role !== 'owner') {
//         throw new AppError(403, 'Only owner can perform this action');
//     }

//     if (user.isRegistration === false) {
//         throw new AppError(400, 'Owner registration not completed');
//     }

//     const isServiceExists = await OwnerService.findById(id);

//     if (!isServiceExists) {
//         throw new AppError(404, 'This service is not found');
//     }

//     const { deleteKey, ...updateData } = payload;

//     // Handle image upload to S3
//     if (files) {
//         const { images } = files as UploadedFiles;

//         if (images?.length) {
//             const imgsArray = images.map((image) => ({
//                 file: image,
//                 path: `images/service`,
//             }));

//             try {
//                 payload.images = await uploadManyToS3(imgsArray);
//             } catch (error) {
//                 throw new AppError(500, 'Image upload failed');
//             }
//         }
//     }

//     // Handle image deletions (if any)
//     if (deleteKey && deleteKey.length > 0) {
//         const newKey = deleteKey.map((key: any) => `images/service/${key}`);

//         if (newKey.length > 0) {
//             await deleteManyFromS3(newKey); // Delete images from S3
//             // Remove deleted images from the product
//             await OwnerService.findByIdAndUpdate(
//                 id,
//                 {
//                     $pull: { images: { key: { $in: deleteKey } } },
//                 },
//                 { new: true },
//             );
//         }
//     }

//     // If new images are provided, push them to the service
//     if (payload?.images && payload.images.length > 0) {
//         try {
//             await OwnerService.findByIdAndUpdate(
//                 id,
//                 { $addToSet: { images: { $each: payload.images } } }, // Push new images to the product
//                 { new: true },
//             );
//             delete payload.images; // Remove images from the payload after pushing
//         } catch (error) {
//             throw new AppError(400, 'Failed to update images');
//         }
//     }

//     // Update other product details
//     try {
//         const result = await OwnerService.findByIdAndUpdate(id, updateData, {
//             new: true,
//         });
//         if (!result) {
//             throw new AppError(400, 'Service update failed');
//         }

//         return result;
//     } catch (error: any) {
//         console.log(error);
//         throw new AppError(500, 'Service update failed');
//     }
// };

// const deleteServiceFromDB = async (id: string) => {
//     const isServiceExists = await OwnerService.findById(id);

//     if (!isServiceExists) {
//         throw new AppError(404, 'This service is not found');
//     }

//     const result = await OwnerService.findByIdAndUpdate(
//         id,
//         { isDeleted: true },
//         { new: true },
//     );
//     if (!result) {
//         throw new AppError(400, 'Failed to delete service');
//     }

//     return result;
// };

export const GalleryServices = {
  createGalleryIntoDB,
  getGalleryFromDB,
};
