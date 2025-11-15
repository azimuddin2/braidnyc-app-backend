import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OnServiceServices } from './onService.service';

const createOnService = catchAsync(async (req, res) => {
  const userId = req.user.userId;

  const result = await OnServiceServices.createOnServiceIntoDB(
    userId,
    req.body,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'On Service created successfully',
    data: result,
  });
});

const getAllOnService = catchAsync(async (req, res) => {
  const result = await OnServiceServices.getAllOnServiceFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'On Services retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getOnServiceById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OnServiceServices.getOnServiceByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'On Service retrieved successfully',
    data: result,
  });
});

const updateOnService = catchAsync(async (req, res) => {
  const userId = req.user.userId;

  const { id } = req.params;
  const result = await OnServiceServices.updateOnServiceIntoDB(
    userId,
    id,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'On Service updated successfully',
    data: result,
  });
});

const deleteOnService = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OnServiceServices.deleteOnServiceFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'On Service deleted successfully',
    data: result,
  });
});

export const OnServiceControllers = {
  createOnService,
  getAllOnService,
  getOnServiceById,
  updateOnService,
  deleteOnService,
};
