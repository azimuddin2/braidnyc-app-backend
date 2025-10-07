import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { SubPaymentsService } from './sub-payment.services';

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

// const confirmPayment = catchAsync(async (req: Request, res: Response) => {
//   const result = await SubPaymentsService.confirmPayment(req?.query);
//   if (!result?.subscription && !result?.sponsorId) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       'No valid subscription or sponsor found for payment confirmation',
//     );
//   }

//   let subscriptionredirectUrl = `${config}?paymentId=${result?._id}`;
//   let sponsorredirectUrl = `${config.success_sponsor_url}?paymentId=${result?._id}`;

//   if (result?.subscription) {
//     subscriptionredirectUrl += `&subscriptionId=${result.subscription}`;
//     res.redirect(subscriptionredirectUrl);
//   }

//   if (result?.sponsorId) {
//     sponsorredirectUrl += `&sponsorId=${result.sponsorId}`;
//     res.redirect(sponsorredirectUrl);
//   }
// });

export const SubPaymentsController = {
  subPayCheckout,
};
