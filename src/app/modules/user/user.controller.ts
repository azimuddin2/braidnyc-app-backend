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

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsersFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Users retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getUserProfile = catchAsync(async (req, res) => {
  const { email } = req.params;
  const result = await UserServices.getUserProfileFromDB(email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  });
});

const updateUserProfile = catchAsync(async (req, res) => {
  const { email } = req.params;
  const result = await UserServices.updateUserProfileIntoDB(
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

export const UserControllers = {
  registerUser,
  vendorRegisterUser,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
};
