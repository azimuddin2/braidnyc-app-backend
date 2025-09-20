import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PaymentService } from './payment.service';
import config from '../../config';

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const url = await PaymentService.createPayment(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Payment created successfully',
    data: url,
  });
});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  await PaymentService.confirmPayment(req.query);

  res.redirect(config.client_Url + '/payment/success');
});

export const PaymentController = {
  createPayment,
  confirmPayment,
};
