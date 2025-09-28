import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AboutService } from './about.service';

const createAbout = catchAsync(async (req, res) => {
  const result = await AboutService.createAboutIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'About info added successfully',
    data: result,
  });
});

const getAboutById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AboutService.getAboutByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'About info retrieved successfully',
    data: result,
  });
});

const updateAbout = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AboutService.updateAboutIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'About info has been updated successfully.',
    data: result,
  });
});

const deleteAbout = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AboutService.deleteAboutFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'About info deleted successfully',
    data: result,
  });
});

export const AboutController = {
  createAbout,
  getAboutById,
  updateAbout,
  deleteAbout,
};
