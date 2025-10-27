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

export const FreelancerRegistrationController = {
  createFreelancerRegistration,
};
