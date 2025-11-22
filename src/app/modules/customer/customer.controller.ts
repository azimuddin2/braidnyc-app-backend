import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CustomerService } from './customer.service';

const getAllRecommendOwner = catchAsync(async (req, res) => {
  const result = await CustomerService.getAllRecommendOwnerFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Owner profile retrieved successfully',
    data: result,
  });
});

const getTopFeaturedStylist = catchAsync(async (req, res) => {
  const result = await CustomerService.getTopFeaturedStylistFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Top featured stylist profile retrieved successfully',
    data: result,
  });
});

export const CustomerController = {
  getAllRecommendOwner,
  getTopFeaturedStylist,
};
