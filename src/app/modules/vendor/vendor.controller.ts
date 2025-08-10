import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { VendorServices } from './vendor.service';

const getVendorProfile = catchAsync(async (req, res) => {
  const { email } = req.params;
  const result = await VendorServices.getVendorProfileFromDB(email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  });
});

const updateVendorProfile = catchAsync(async (req, res) => {
  const { email } = req.params;
  const result = await VendorServices.updateVendorProfileIntoDB(
    email,
    req.body,
    req.file,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile has been updated successfully.',
    data: result,
  });
});

export const VendorControllers = {
  getVendorProfile,
  updateVendorProfile,
};
