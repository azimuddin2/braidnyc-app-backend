import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PrivacyService } from './privacy.service';

const getPrivacy = catchAsync(async (req, res) => {
  const result = await PrivacyService.getPrivacyFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Privacy policy retrieved successfully',
    data: result,
  });
});

const upsertPrivacy = catchAsync(async (req, res) => {
  const result = await PrivacyService.upsertPrivacyIntoDB(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Privacy policy saved successfully',
    data: result,
  });
});

const deletePrivacy = catchAsync(async (req, res) => {
  const result = await PrivacyService.deletePrivacyFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Privacy policy deleted successfully',
    data: result,
  });
});

export const PrivacyController = {
  getPrivacy,
  upsertPrivacy,
  deletePrivacy,
};
