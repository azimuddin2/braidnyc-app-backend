import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { SubPaymentsService } from './sub-payment.services';
import AppError from '../../errors/AppError';
import config from '../../config';

const subPayCheckout = catchAsync(async (req: Request, res: Response) => {
  req.body.user = req.user?.userId;
  const result = await SubPaymentsService.subPayCheckout(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'payment link get successful',
  });
});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await SubPaymentsService.confirmPayment(req?.query);
  console.log('confirmPayment result', result);

  // if (!result?.subscription) {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     'No valid subscription found for payment confirmation'
  //   );
  // }

  // // Build redirect URL for successful subscription payment
  // const queryParams = new URLSearchParams({
  //   paymentId: String(result._id),
  //   subscriptionId: String(result.subscription),
  // });

  // const redirectUrl = `${config.client_Url}/payment/success?${queryParams.toString()}`;

  // res.redirect(redirectUrl);
});

export const SubPaymentsController = {
  subPayCheckout,
  confirmPayment
};
