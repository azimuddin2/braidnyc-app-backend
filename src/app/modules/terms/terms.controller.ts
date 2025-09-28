import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TermsService } from './terms.service';

const getTerms = catchAsync(async (req, res) => {
  const result = await TermsService.getTermsFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Terms retrieved successfully',
    data: result,
  });
});

const upsertTerms = catchAsync(async (req, res) => {
  const result = await TermsService.upsertTermsIntoDB(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Terms saved successfully',
    data: result,
  });
});

const deleteTerms = catchAsync(async (req, res) => {
  const result = await TermsService.deleteTermsFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Terms deleted successfully',
    data: result,
  });
});

export const TermsController = {
  getTerms,
  upsertTerms,
  deleteTerms,
};
