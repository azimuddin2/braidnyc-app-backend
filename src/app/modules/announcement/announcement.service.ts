import AppError from '../../errors/AppError';
import { uploadManyToS3 } from '../../utils/awsS3FileUploader';
import { TAnnouncement } from './announcement.interface';
import { Announcement } from './announcement.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createAnnouncementIntoDB = async (files: any) => {
  // Strict image check
  if (!files || !Array.isArray(files.images) || files.images.length === 0) {
    throw new AppError(400, 'At least one image is required');
  }

  // Prepare upload array
  const imgsArray = files.images.map((image: any) => ({
    file: image,
    path: `images/announcement`,
  }));

  // Upload to S3
  let uploadedImages: any[] = [];
  try {
    uploadedImages = await uploadManyToS3(imgsArray);
  } catch (error) {
    throw new AppError(500, 'Image upload failed');
  }

  // Always create a new gallery entry
  const payload: Partial<TAnnouncement> = {
    images: uploadedImages,
    deleteKey: uploadedImages.map((img) => img.key),
  };

  const result = await Announcement.create(payload);

  if (!result) {
    throw new AppError(400, 'Failed to create announcement');
  }

  return result;
};

const getAllAnnouncementFromDB = async (query: Record<string, unknown>) => {
  const announcementQuery = new QueryBuilder(
    Announcement.find({ isDeleted: false }),
    query,
  )
    .search([''])
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await announcementQuery.countTotal();
  const result = await announcementQuery.modelQuery;

  return { meta, result };
};

const deleteAnnouncementFromDB = async (id: string) => {
  const isAnnouncementExists = await Announcement.findById(id);

  if (!isAnnouncementExists) {
    throw new AppError(404, 'Announcement not found');
  }

  const result = await Announcement.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(400, 'Failed to delete announcement');
  }

  return result;
};

export const AnnouncementServices = {
  createAnnouncementIntoDB,
  getAllAnnouncementFromDB,
  deleteAnnouncementFromDB,
};
