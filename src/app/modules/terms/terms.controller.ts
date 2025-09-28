import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TermsService } from './terms.service';

const createTerms = catchAsync(async (req, res) => {
  const result = await TermsService.createTermsIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Terms added successfully',
    data: result,
  });
});

const getTermsById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TermsService.getTermsByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Terms retrieved successfully',
    data: result,
  });
});

const updateTerms = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TermsService.updateTermsIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Terms has been updated successfully.',
    data: result,
  });
});

const deleteTerms = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TermsService.deleteTermsFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Terms deleted successfully',
    data: result,
  });
});

export const TermsController = {
  createTerms,
  getTermsById,
  updateTerms,
  deleteTerms,
};
