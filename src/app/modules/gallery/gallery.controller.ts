import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { GalleryServices } from './gallery.service';

const createGallery = catchAsync(async (req, res) => {
  const userId = req.user.userId;

  const result = await GalleryServices.createGalleryIntoDB(userId, req.files);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Gallery created successfully',
    data: result,
  });
});

const getGallery = catchAsync(async (req, res) => {
  const result = await GalleryServices.getGalleryFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Gallery retrieved successfully',
    data: result,
  });
});

const updateGallery = catchAsync(async (req, res) => {
  const userId = req.user.userId;

  const result = await GalleryServices.updateGalleryIntoDB(
    userId,
    req.body,
    req.files,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Gallery updated successfully',
    data: result,
  });
});

export const GalleryControllers = {
  createGallery,
  getGallery,
  updateGallery,
};
