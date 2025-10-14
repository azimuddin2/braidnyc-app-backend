import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const signupCustomer = catchAsync(async (req, res) => {
  const result = await UserServices.signupCustomerIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const signupOwner = catchAsync(async (req, res) => {
  const result = await UserServices.signupOwnerIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Salon owner registered successfully',
    data: result,
  });
});

const signupFreelance = catchAsync(async (req, res) => {
  const result = await UserServices.signupFreelanceIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Freelance account registered successfully',
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

const changeStatus = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await UserServices.changeStatusIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: `User is ${result.status} successfully!`,
    data: result,
  });
});

export const UserControllers = {
  signupCustomer,
  signupOwner,
  signupFreelance,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  changeStatus,
};
