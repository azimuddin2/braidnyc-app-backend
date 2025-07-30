import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PackagesServices } from './packages.service';

const createPackages = catchAsync(async (req, res) => {
  const result = await PackagesServices.createPackagesIntoDB(
    req.body,
    req.files,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Service created successfully',
    data: result,
  });
});

export const PackagesControllers = {
  createPackages,
};
