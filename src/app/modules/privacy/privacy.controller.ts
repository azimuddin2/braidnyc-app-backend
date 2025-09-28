import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PrivacyService } from './privacy.service';

const createPrivacy = catchAsync(async (req, res) => {
  const result = await PrivacyService.createPrivacyIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Privacy added successfully',
    data: result,
  });
});

const getPrivacyById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PrivacyService.getPrivacyByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Privacy retrieved successfully',
    data: result,
  });
});

const updatePrivacy = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PrivacyService.updatePrivacyIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Privacy has been updated successfully.',
    data: result,
  });
});

const deletePrivacy = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PrivacyService.deletePrivacyFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Privacy deleted successfully',
    data: result,
  });
});

export const PrivacyController = {
  createPrivacy,
  getPrivacyById,
  updatePrivacy,
  deletePrivacy,
};
