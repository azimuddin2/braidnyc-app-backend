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

// const getAllService = catchAsync(async (req, res) => {
//   const result = await OwnerServiceServices.getAllServiceFromDB(req.query);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Services retrieved successfully',
//     meta: result.meta,
//     data: result.result,
//   });
// });

// const getServiceById = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await OwnerServiceServices.getServiceByIdFromDB(id);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Service retrieved successfully',
//     data: result,
//   });
// });

// const updateService = catchAsync(async (req, res) => {
//   const userId = req.user.userId;

//   const { id } = req.params;
//   const result = await OwnerServiceServices.updateServiceIntoDB(
//     userId,
//     id,
//     req.body,
//     req.files,
//   );

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Service updated successfully',
//     data: result,
//   });
// });

// const deleteService = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await OwnerServiceServices.deleteServiceFromDB(id);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Service deleted successfully',
//     data: result,
//   });
// });

export const GalleryControllers = {
  createGallery,
};
