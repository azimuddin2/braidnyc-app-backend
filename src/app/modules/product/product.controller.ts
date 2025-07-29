import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProductServices } from './product.service';

const createProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.createProductIntoDB(req.body, req.files);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Products created successfully',
    data: result,
  });
});

export const ProductControllers = {
  createProduct,
};
