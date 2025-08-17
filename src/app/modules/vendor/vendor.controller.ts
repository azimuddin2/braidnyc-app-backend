import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { VendorServices } from './vendor.service';

const getAllVendors = catchAsync(async (req, res) => {
  const result = await VendorServices.getAllVendorsFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Vendor retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

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
  getAllVendors,
  getVendorProfile,
  updateVendorProfile,
};
