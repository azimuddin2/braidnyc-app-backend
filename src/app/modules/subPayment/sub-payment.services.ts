import Stripe from 'stripe';
import config from '../../config';
import httpStatus from 'http-status';
import { startSession } from 'mongoose';
import moment from 'moment';
import { TSubPayment } from './sub-payment.interface';
import generateRandomString from '../../utils/generateRandomString';
import { User } from '../user/user.model';
import { Subscription } from '../subscription/subscription.model';
import AppError from '../../errors/AppError';
import SubPayment from './sub-payment.module';
import { Plan } from '../plan/plan.model';
import { createCheckoutSession } from './sub-payment.utils';

export const stripe = new Stripe(config.stripe_api_secret as string, {
  apiVersion: '2025-08-27.basil',
  typescript: true,
});

const subPayCheckout = async (payload: TSubPayment) => {
  // console.log('subPayCheckout paylaod', payload);

  const tranId = generateRandomString(10);
  let paymentData: TSubPayment;

  const user = await User.findById(payload.user);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!")
  }

  const isPlan = await Plan.findById(payload?.plan)
  if (!isPlan) {
    throw new AppError(httpStatus.NOT_FOUND, "Plan not found!")
  }

  payload.amount = isPlan.cost || 0
  const createdPayment = await SubPayment.create(payload);
  console.log("createdPayment", createdPayment);
  if (!createdPayment) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create payment');
  }

  paymentData = createdPayment
  if (!paymentData) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create payment');
  }
  // console.log('paymentData___________', paymentData);

  const checkoutSession = await createCheckoutSession({
    product: {
      amount: paymentData?.amount,
      name: isPlan?.name,
      quantity: 1,
    },
    //@ts-ignore
    paymentId: paymentData?._id,
  });
  // console.log("checkoutSession", checkoutSession);
  return checkoutSession?.url;

  // END
};

const confirmPayment = async (query: Record<string, any>) => {
  console.log('query________', query);

  const { sessionId, paymentId } = query;
  const session = await startSession();
  const PaymentSession = await stripe.checkout.sessions.retrieve(sessionId);
  // console.log('PaymentSession', PaymentSession);

  const paymentIntentId = PaymentSession.payment_intent as string;

  if (PaymentSession.status !== 'complete') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Payment session is not completed',
    );
  }

  try {
    session.startTransaction();



    await session.commitTransaction();
    return "payment";
  } catch (error: any) {
    await session.abortTransaction();

    if (paymentIntentId) {
      try {
        await stripe.refunds.create({ payment_intent: paymentIntentId });
      } catch (refundError: any) {
        console.error('Error processing refund:', refundError.message);
      }
    }

    throw new AppError(httpStatus.BAD_GATEWAY, error.message);
  } finally {
    session.endSession();
  }
};

export const SubPaymentsService = {
  subPayCheckout,
  confirmPayment
};
