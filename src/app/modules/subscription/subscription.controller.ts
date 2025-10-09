import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SubscriptionService } from './subscription.service';
import { SubPaymentsService } from '../subPayment/sub-payment.services';

const createSubscription = catchAsync(async (req: Request, res: Response) => {
  // console.log('user', req.user);

  req.body.user = req?.user?.userId;
  const result = await SubscriptionService.createSubscriptionIntoDB(req.body);
  // console.log('createSubscription result', result);

  const createPayment = await SubPaymentsService.subPayCheckout({
    // @ts-ignore
    plan: result?.plan,
    // @ts-ignore
    subscription: result._id,
    user: req?.user?.userId,
    durationType: result?.durationType,
  });
  // console.log('createPayment', createPayment);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscription created successfully',
    data: createPayment,
  });
});

const getAllSubscription = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionService.getAllSubscriptionFromDB(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All subscriptions fetched successfully',
    data: result,
  });
});

const getMySubscription = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionService.getSubscriptionByUserIdFromDB(
    req.user?.userId,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All subscriptions fetched successfully',
    data: result,
  });
});

// const getSubscriptionById = catchAsync(async (req: Request, res: Response) => {
//   const result = await SubscriptionService.getSubscriptionById(req.params.id);
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Subscription fetched successfully',
//     data: result,
//   });
// });

// const getSubscriptionByUserId = catchAsync(
//   async (req: Request, res: Response) => {
//     const result = await SubscriptionService.getSubscriptionByUserId(
//       req.params.userId,
//     );
//     sendResponse(res, {
//       statusCode: 200,
//       success: true,
//       message: 'Subscription fetched successfully',
//       data: result,
//     });
//   },
// );

const updateSubscription = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionService.updateSubscriptionIntoDB(
    req.params.id,
    req.body,
  );

  // const updatePayment = await paymentsService.checkout({
  //   // @ts-ignore
  //   subscription: result._id,
  //   user: req?.user?.userId,
  //   durationType: result?.durationType,
  // });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscription updated successfully',
    data: 'updatePayment',
  });
});

// const deleteSubscription = catchAsync(async (req: Request, res: Response) => {
//   const result = await SubscriptionService.deleteSubscription(req.params.id);
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Subscription deleted successfully',
//     data: result,
//   });
// });

// const cancelSubscription = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const subscription = await SubscriptionService.findOne({ _id: id });
//   // console.log('subscription', subscription);

//   if (!subscription) {
//     return res.status(404).json({ message: 'Subscription not found' });
//   }

//   const subscriptionId = subscription.trnId;

//   // Cancel the subscription on Stripe
//   const result = await stripeService.cancelStripeSubscription(subscriptionId);
//   // console.log('result', result);

//   // Update the subscription status in the database
//   await Subscription.findOneAndUpdate(
//     { _id: id },
//     { isDeleted: true, isPaid: false, isExpired: true },
//     { new: true },
//   );

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Subscription canceled successfully',
//     data: result,
//   });
// });

export const SubscriptionController = {
  createSubscription,
  getAllSubscription,
  updateSubscription,
  getMySubscription,
};
