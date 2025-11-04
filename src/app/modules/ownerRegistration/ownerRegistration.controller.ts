import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OwnerRegistrationService } from './ownerRegistration.service';

const createOwnerRegistration = catchAsync(async (req, res) => {
  const userId = req.user.userId;

  const result = await OwnerRegistrationService.createOwnerRegistrationIntoDB(
    userId,
    req.body,
    req.files as {
      idDocument?: Express.Multer.File[];
      businessRegistration?: Express.Multer.File[];
      salonFrontPhoto?: Express.Multer.File[];
      salonInsidePhoto?: Express.Multer.File[];
      salonPhoto?: Express.Multer.File[];
    },
  );

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'Owner registration successfully',
    data: result,
  });
});

const getAllOwnerRegistration = catchAsync(async (req, res) => {
  const result = await OwnerRegistrationService.getAllOwnerRegistrationFromDB(
    req.query,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Owners retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getOwnerRegistrationById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await OwnerRegistrationService.getOwnerRegistrationByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Owner retrieved successfully',
    data: result,
  });
});

const getOwnerProfile = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  console.log(userId);
  const result = await OwnerRegistrationService.getOwnerProfileFromDB(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Owner profile successfully',
    data: result,
  });
});

const updateOwnerRegistration = catchAsync(async (req, res) => {
  const userId = req.user.userId;

  const { id } = req.params;
  const result = await OwnerRegistrationService.updateOwnerRegistrationIntoDB(
    userId,
    id,
    req.body,
    req.file,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Salon details updated successfully',
    data: result,
  });
});

export const OwnerRegistrationController = {
  createOwnerRegistration,
  getAllOwnerRegistration,
  getOwnerRegistrationById,
  getOwnerProfile,
  updateOwnerRegistration,
};
