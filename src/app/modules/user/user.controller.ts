import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

import { UserServices } from './user.service';

const registerUser = catchAsync(async (req, res) => {
  const result = await UserServices.registerUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const vendorRegisterUser = catchAsync(async (req, res) => {
  const result = await UserServices.vendorRegisterUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Vendor User registered successfully',
    data: result,
  });
});

export const UserControllers = {
  registerUser,
  vendorRegisterUser,
};
