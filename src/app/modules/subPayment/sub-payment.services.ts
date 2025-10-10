import Stripe from 'stripe';
import config from '../../config';
import httpStatus from 'http-status';
import { startSession } from 'mongoose';
import { TSubPayment } from './sub-payment.interface';
import generateRandomString from '../../utils/generateRandomString';
import { User } from '../user/user.model';
import AppError from '../../errors/AppError';
import SubPayment from './sub-payment.module';
import { Plan } from '../plan/plan.model';
import { createCheckoutSession } from './sub-payment.utils';

export const stripe = new Stripe(config.stripe_api_secret as string, {
  apiVersion: '2025-08-27.basil',
  typescript: true,
});

const subPayCheckout = async (payload: TSubPayment) => {
  const tranId = `TXN-${generateRandomString(10)}`;

  // 1️⃣ Validate User
  const user = await User.findById(payload.user);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // 2️⃣ Validate Plan
  const plan = await Plan.findById(payload.plan);
  if (!plan) {
    throw new AppError(httpStatus.NOT_FOUND, 'Plan not found!');
  }

  // 3️⃣ Create Payment Entry
  const modifyPayload: Partial<TSubPayment> = {
    ...payload,
    tranId,
    amount: plan.cost || 0,
  };

  const createdPayment = await SubPayment.create(modifyPayload);
  if (!createdPayment) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create payment');
  }

  // 4️⃣ Create Checkout Session
  const checkoutSession = await createCheckoutSession({
    product: {
      amount: createdPayment.amount,
      name: plan.name,
      quantity: 1,
    },
    //@ts-ignore
    paymentId: createdPayment._id,
  });

  if (!checkoutSession?.url) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to create checkout session',
    );
  }

  // 5️⃣ Return Payment URL
  return checkoutSession.url;
};

const confirmPayment = async (query: Record<string, any>) => {
  console.log('query________', query);

  const { sessionId, paymentId } = query;
  const session = await startSession();

  // ✅ Stripe payment process
  const paymentSession = await stripe.checkout.sessions.retrieve(sessionId);
  const paymentIntentId = paymentSession.payment_intent as string;

  // ✅ Stripe now uses `payment_status` instead of `status`
  if (paymentSession.payment_status !== 'paid') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Payment not completed yet');
  }

  try {
    session.startTransaction();

    // ✅ Verify payment record exists
    const payment = await SubPayment.findById(paymentId).session(session);
    if (!payment) {
      throw new AppError(httpStatus.NOT_FOUND, 'Payment record not found!');
    }

    // ✅ Update payment inside the same transaction
    const updatedPayment = await SubPayment.findByIdAndUpdate(
      paymentId,
      {
        $set: {
          isPaid: true,
          paidAt: new Date(),
        },
      },
      { new: true, session }, // <-- 🔥 include session here
    );

    await session.commitTransaction();

    console.log('✅ Payment updated successfully:', updatedPayment);
    return updatedPayment;
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
  confirmPayment,
};
