import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
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

const updateGalleryIntoDB = async (
  userId: string,
  payload: Partial<TGallery>,
  files?: any,
) => {
  // 1️⃣ Validate User
  const user = await User.findById(userId).select('role isRegistration');
  if (!user) throw new AppError(404, 'User not found');

  if (!['owner', 'freelancer'].includes(user.role)) {
    throw new AppError(403, 'Only owner or freelancer can update gallery');
  }

  if (!user.isRegistration) {
    throw new AppError(400, 'Registration not completed');
  }

  // 2️⃣ Find existing gallery
  const existingGallery = await Gallery.findOne({ user: userId });
  if (!existingGallery) {
    throw new AppError(404, 'Gallery not found');
  }

  // 3️⃣ Parse deleteKey if coming as string
  if (typeof payload.deleteKey === 'string') {
    try {
      payload.deleteKey = JSON.parse(payload.deleteKey);
    } catch {
      throw new AppError(400, 'Invalid deleteKey format');
    }
  }

  // 4️⃣ Upload new images (if provided)
  let uploadedImages: any[] = [];
  const galleryFiles = files?.images ?? files?.['images'];

  if (Array.isArray(galleryFiles) && galleryFiles.length > 0) {
    const imgsArray = galleryFiles.map((image: any) => ({
      file: image,
      path: `images/gallery`,
    }));

    try {
      uploadedImages = await uploadManyToS3(imgsArray);
    } catch (error) {
      throw new AppError(500, 'Image upload failed');
    }
  }

  // 5️⃣ Delete existing images (if deleteKey provided)
  if (Array.isArray(payload.deleteKey) && payload.deleteKey.length > 0) {
    const keysToDelete = payload.deleteKey.map(
      (key: string) => `images/gallery/${key}`,
    );

    try {
      await deleteManyFromS3(keysToDelete); // Remove from AWS S3

      // Remove from local MongoDB document
      existingGallery.images = existingGallery.images.filter(
        (img: any) => !payload.deleteKey!.includes(img.key),
      );

      existingGallery.deleteKey = existingGallery.deleteKey.filter(
        (key: string) => !payload.deleteKey!.includes(key),
      );
    } catch (error) {
      throw new AppError(500, 'Failed to delete images');
    }
  }

  // 6️⃣ Add newly uploaded images to gallery
  if (uploadedImages.length > 0) {
    existingGallery.images.push(...uploadedImages);
    existingGallery.deleteKey.push(...uploadedImages.map((img) => img.key));
  }

  // 7️⃣ Save updated gallery
  const updatedGallery = await existingGallery.save();
  if (!updatedGallery) throw new AppError(400, 'Failed to update gallery');

  return updatedGallery;
};

export const GalleryServices = {
  createGalleryIntoDB,
  getGalleryFromDB,
  updateGalleryIntoDB,
};
