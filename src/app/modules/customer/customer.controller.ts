import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CustomerService } from './customer.service';

const getAllRecommendOwner = catchAsync(async (req, res) => {
  const result = await CustomerService.getAllRecommendOwnerFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Freelancers retrieved successfully',
    data: result,
  });
});

export const CustomerController = {
  getAllRecommendOwner,
};
