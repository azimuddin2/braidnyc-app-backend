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

export const stripe = new Stripe(config.stripe_api_secret as string, {
  apiVersion: '2025-08-27.basil',
  typescript: true,
});

const subPayCheckout = async (payload: TSubPayment) => {
  console.log('paylaod', payload);

  const tranId = generateRandomString(10);
  let paymentData: TSubPayment;

  const user = await User.findById(payload.user);
  console.log('user', user);
};

// const confirmPayment = async (query: Record<string, any>) => {
//   // console.log('query', query);

//   const { sessionId, paymentId } = query;
//   const session = await startSession();
//   const PaymentSession = await stripe.checkout.sessions.retrieve(sessionId);
//   // console.log('PaymentSession', PaymentSession);

//   const paymentIntentId = PaymentSession.payment_intent as string;

//   if (PaymentSession.status !== 'complete') {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       'Payment session is not completed',
//     );
//   }

//   try {
//     session.startTransaction();

//     const payment = await SubPayment.findByIdAndUpdate(
//       paymentId,
//       { isPaid: true, paymentIntentId: paymentIntentId },
//       { new: true, session },
//     ).populate('user');

//     if (!payment) {
//       throw new AppError(httpStatus.NOT_FOUND, 'Payment Not Found!');
//     }

//     const oldSubscription = await Subscription.findOneAndUpdate(
//       {
//         user: payment?.user,
//       },
//       {
//         $set: {
//           isPaid: true,
//           isExpired: true,
//         },
//       },
//       {
//         upsert: false,
//         session,
//       },
//     );

//     const subscription: ISubscriptions | null = await Subscription.findById(
//       payment?.subscription,
//     )
//       .populate('package')
//       .session(session);

//     let expiredAt = moment();

//     if (
//       oldSubscription?.expiredAt &&
//       moment(oldSubscription.expiredAt).isAfter(moment())
//     ) {
//       const remainingTime = moment(oldSubscription.expiredAt).diff(moment());
//       expiredAt = moment().add(remainingTime, 'milliseconds');
//     }

//     if (
//       oldSubscription?.expiredAt &&
//       moment(oldSubscription.expiredAt).isAfter(moment())
//     ) {
//       const remainingTime = moment(oldSubscription.expiredAt).diff(moment());
//       expiredAt = moment().add(remainingTime, 'milliseconds');
//     }

//     if (subscription?.durationType) {
//       const durationDay =
//         subscription.durationType === 'monthly'
//           ? 30
//           : subscription.durationType === 'yearly'
//             ? 365
//             : 0;
//       expiredAt = expiredAt.add(durationDay, 'days');
//     }

//     // console.log('payment___for update', payment);

//     await Subscription.findByIdAndUpdate(
//       payment?.subscription,
//       {
//         isPaid: true,
//         trnId: PaymentSession.subscription,
//         expiredAt: expiredAt.toDate(),
//       },
//       { session },
//     ).populate('package');

//     const user = await User.findById(payment?.user).session(session);

//     const packageDetails = subscription?.package as IPackage;
//     const newUser: any = {};
//     if (packageDetails) {
//       newUser['codeGenetarelimit'] =
//         (user?.codeGenetarelimit || 0) +
//         (packageDetails.codeGenetarelimit || 0);
//       // Update user with the codeGenetarelimit from the package

//       // Determine the duration in days based on the subscription's durationType
//       let additionalDays = 0;
//       if (subscription?.durationType === 'monthly') {
//         additionalDays = 30;
//       } else if (subscription?.durationType === 'yearly') {
//         additionalDays = 365;
//       }

//       // Update the user's durationDay with the additional days based on the subscription durationType
//       // newUser['durationDay'] = user?.durationDay || 0 + additionalDays;
//       newUser['durationDay'] = (user?.durationDay || 0) + additionalDays;

//       await User.findByIdAndUpdate(
//         payment?.user,
//         { ...newUser, isSubscribed: true },
//         { timestamps: false, session },
//       );
//     }

//     await Package.findByIdAndUpdate(
//       packageDetails?._id,
//       { $inc: { popularity: 1 } },
//       { upsert: false, new: true, session },
//     );

//     const admin = await User.findOne({ role: USER_ROLE.admin });
//     const subs = await Payment.findOne({ paymentId: payment._id });

//     if (subs?.subscription) {
//       await notificationServices.insertNotificationIntoDb({
//         receiver: admin?._id,
//         message: 'A new subscription payment has been made.',
//         description: `User ${(payment.user as IUser)?.email} has successfully made a payment for their subscription. Payment ID: ${payment._id}.`,
//         refference: payment?._id,
//         model_type: modeType?.Payment,
//       });
//     } else {
//       await notificationServices.insertNotificationIntoDb({
//         receiver: admin?._id,
//         message: 'A new sponsor payment has been made.',
//         description: `User ${(payment.user as IUser)?.email} has successfully made a payment for their sponsor. Payment ID: ${payment._id}.`,
//         refference: payment?._id,
//         model_type: modeType?.Payment,
//       });
//     }
//     await session.commitTransaction();
//     return payment;
//   } catch (error: any) {
//     await session.abortTransaction();

//     if (paymentIntentId) {
//       try {
//         await stripe.refunds.create({ payment_intent: paymentIntentId });
//       } catch (refundError: any) {
//         console.error('Error processing refund:', refundError.message);
//       }
//     }

//     throw new AppError(httpStatus.BAD_GATEWAY, error.message);
//   } finally {
//     session.endSession();
//   }
// };

export const SubPaymentsService = {
  subPayCheckout,
};
