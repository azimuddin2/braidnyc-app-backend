import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FreelancerRegistrationService } from './freelancerRegistration.service';

const createFreelancerRegistration = catchAsync(async (req, res) => {
  const userId = req.user.userId;

  const result =
    await FreelancerRegistrationService.createFreelancerRegistrationIntoDB(
      userId,
      req.body,
      req.files as {
        profile?: Express.Multer.File[];
        idDocument?: Express.Multer.File[];
        businessRegistration?: Express.Multer.File[];
      },
    );

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'Freelancer registration successfully',
    data: result,
  });
});

const getAllFreelancers = catchAsync(async (req, res) => {
  const result = await FreelancerRegistrationService.getAllFreelancersFromDB(
    req.query,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Freelancers retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getAllFreelancerRequest = catchAsync(async (req, res) => {
  const result =
    await FreelancerRegistrationService.getAllFreelancerRequestFromDB(
      req.query,
    );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Freelancers request retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getFreelancerById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await FreelancerRegistrationService.getFreelancerByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Freelancer retrieved successfully',
    data: result,
  });
});

const getFreelancerProfile = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result =
    await FreelancerRegistrationService.getFreelancerProfileFromDB(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Freelancer profile retrieved successfully',
    data: result,
  });
});

const updateFreelancerRegistration = catchAsync(async (req, res) => {
  const userId = req.user.userId;

  const { id } = req.params;
  const result =
    await FreelancerRegistrationService.updateFreelancerRegistrationIntoDB(
      userId,
      id,
      req.body,
      req.file,
    );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Freelancer details updated successfully',
    data: result,
  });
});

export const FreelancerRegistrationController = {
  createFreelancerRegistration,
  getAllFreelancers,
  getAllFreelancerRequest,
  getFreelancerById,
  getFreelancerProfile,
  updateFreelancerRegistration,
};
