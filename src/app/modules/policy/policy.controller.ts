import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PolicyService } from './policy.service';

const createPolicy = catchAsync(async (req, res) => {
  const result = await PolicyService.createPolicyIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Policy added successfully',
    data: result,
  });
});

const getPolicyById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PolicyService.getPolicyByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Policy retrieved successfully',
    data: result,
  });
});

const updatePolicy = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PolicyService.updatePolicyIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Policy has been updated successfully.',
    data: result,
  });
});

const deletePolicy = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PolicyService.deletePolicyFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Policy deleted successfully',
    data: result,
  });
});

export const PolicyController = {
  createPolicy,
  getPolicyById,
  updatePolicy,
  deletePolicy,
};
