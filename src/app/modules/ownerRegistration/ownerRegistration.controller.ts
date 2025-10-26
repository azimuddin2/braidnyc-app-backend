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

export const OwnerRegistrationController = {
  createOwnerRegistration,
};
