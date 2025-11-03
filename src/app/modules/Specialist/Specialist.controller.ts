import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SpecialistServices } from './Specialist.service';

const createSpecialist = catchAsync(async (req, res) => {
  const userId = req.user.userId;

  const result = await SpecialistServices.createSpecialistIntoDB(
    userId,
    req.body,
    req.file,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Specialist created successfully',
    data: result,
  });
});

const getAllSpecialist = catchAsync(async (req, res) => {
  const result = await SpecialistServices.getAllSpecialistFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Specialist retrieved successfully',
    data: result,
  });
});

const getSpecialistById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SpecialistServices.getSpecialistByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Specialist retrieved successfully',
    data: result,
  });
});

const updateSpecialist = catchAsync(async (req, res) => {
  const userId = req.user.userId;

  const { id } = req.params;
  const result = await SpecialistServices.updateSpecialistIntoDB(
    userId,
    id,
    req.body,
    req.file,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Specialist updated successfully',
    data: result,
  });
});

const deleteSpecialist = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SpecialistServices.deleteSpecialistFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Specialist deleted successfully',
    data: result,
  });
});

export const SpecialistControllers = {
  createSpecialist,
  getAllSpecialist,
  getSpecialistById,
  updateSpecialist,
  deleteSpecialist,
};
