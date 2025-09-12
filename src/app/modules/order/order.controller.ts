import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OrderServices } from './order.service';

const createOrder = catchAsync(async (req, res) => {
  const result = await OrderServices.createOrderIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Product order successfully',
    data: result,
  });
});

const getOrdersByEmail = catchAsync(async (req, res) => {
  const { email } = req.query;
  const result = await OrderServices.getOrdersByEmailFromDB(email as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Orders fetched successfully',
    data: result,
  });
});

const getOrderById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OrderServices.getOrderByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order retrieved successfully',
    data: result,
  });
});

export const OrderControllers = {
  createOrder,
  getOrdersByEmail,
  getOrderById,
};
