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

const getAllProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.getAllProductFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Products retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getProductById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductServices.getProductByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product retrieved successfully',
    data: result,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductServices.updateProductIntoDB(
    id,
    req.body,
    req.files,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product updated successfully',
    data: result,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductServices.deleteProductFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product deleted successfully',
    data: result,
  });
});

export const ProductControllers = {
  createProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
