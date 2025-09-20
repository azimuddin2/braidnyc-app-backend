// payment.service.ts
import { startSession } from 'mongoose';
import { PAYMENT_MODEL_TYPE, TPayment } from './payment.interface';
import { Order } from '../order/order.model';
import { Booking } from '../booking/booking.model';
import { Payment } from './payment.model';
import { User } from '../user/user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import config from '../../config';
import StripePaymentService from '../../class/stripe';
import { Product } from '../product/product.model';
import { PAYMENT_STATUS } from './payment.constant';

// 🔹 Helper → calculate commission split (10% admin, 90% vendor)
const calculateAmounts = (price: number) => ({
  adminAmount: price * 0.1,
  vendorAmount: price * 0.9,
});

const createPayment = async (payload: TPayment) => {
  const session = await startSession();
  session.startTransaction();

  try {
    let referenceDoc: any;
    console.log(referenceDoc);

    // 🚀 STEP 1: Fetch Order or Booking (use lean to avoid cyclic object)
    if (payload.modelType === PAYMENT_MODEL_TYPE.Order) {
      console.log();
      referenceDoc = await Order.findById(payload.reference).lean().exec();
      if (!referenceDoc)
        throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
      payload.price = referenceDoc.totalPrice; // 💲 Total order price
    } else if (payload.modelType === PAYMENT_MODEL_TYPE.Booking) {
      referenceDoc = await Booking.findById(payload.reference).lean().exec();
      if (!referenceDoc)
        throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');

      // 🌓 Handle booking payment type
      if (referenceDoc.paymentType === 'half') {
        payload.price = referenceDoc.price / 2; // half payment
      } else if (referenceDoc.paymentType === 'later') {
        payload.price = 0; // pay later
      } else {
        payload.price = referenceDoc.price; // full payment
      }
    }

    // 🚀 STEP 2: Reuse pending payment or create new
    let payment = await Payment.findOne({
      reference: payload.reference,
      modelType: payload.modelType,
      status: 'pending',
      isDeleted: false,
    }).session(session);

    const trnId = Math.random().toString(36).substring(2, 12);

    if (payment) {
      payment.trnId = trnId;
      payment.price = payload.price;
      const { adminAmount, vendorAmount } = calculateAmounts(payload.price);
      payment.adminAmount = adminAmount;
      payment.vendorAmount = vendorAmount;
      await payment.save({ session });
    } else {
      const { adminAmount, vendorAmount } = calculateAmounts(payload.price);
      payment = await Payment.create(
        [
          {
            user: payload.user,
            vendor: payload.vendor,
            modelType: payload.modelType,
            reference: payload.reference,
            trnId,
            price: payload.price,
            adminAmount,
            vendorAmount,
          },
        ],
        { session },
      ).then((docs) => docs[0]);
    }

    if (!payment)
      throw new AppError(httpStatus.BAD_REQUEST, 'Payment creation failed');

    // 🚀 STEP 3: Get or create Stripe Customer (use separate stripeCustomerId field)
    const user = await User.findById(payment.user).session(session);
    if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await StripePaymentService.createCustomer(
        user.email!,
        user.fullName!,
      );
      customerId = customer.id;
      await User.findByIdAndUpdate(user._id, {
        stripeCustomerId: customerId,
      }).session(session);
    }

    // 🚀 STEP 4: Prepare Stripe line items
    const lineItems: any[] = [];
    if (payload.modelType === PAYMENT_MODEL_TYPE.Order) {
      referenceDoc.products.forEach((p: any) => {
        lineItems.push({
          price_data: {
            currency: config.currency,
            product_data: { name: String(p.name) || 'Product' },
            unit_amount: Math.round(Number(p.price) * 100),
          },
          quantity: Number(p.quantity) || 1,
        });
      });
    } else {
      lineItems.push({
        price_data: {
          currency: config.currency,
          product_data: { name: referenceDoc.serviceName || 'Service Booking' },
          unit_amount: Math.round(payload.price * 100),
        },
        quantity: 1,
      });
    }

    // 🚀 STEP 5: Stripe success & cancel URLs
    const successUrl = `${config.server_url}/payments/confirm-payment?sessionId={CHECKOUT_SESSION_ID}&paymentId=${payment._id}`;
    const cancelUrl = `${config.server_url}/payments/cancel?paymentId=${payment._id}`;

    // 🚀 STEP 6: Create Stripe Checkout Session
    const checkoutSession = await StripePaymentService.getCheckoutSession(
      lineItems,
      successUrl,
      cancelUrl,
      config.currency,
      customerId,
    );

    await session.commitTransaction();
    return checkoutSession?.url;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const confirmPayment = async (query: Record<string, any>) => {
  const { sessionId, paymentId } = query;
  const session = await startSession();

  try {
    const paymentSession =
      await StripePaymentService.getPaymentSession(sessionId);
    const paymentIntentId = paymentSession.payment_intent as string;

    const isPaid = await StripePaymentService.isPaymentSuccess(sessionId);
    if (!isPaid)
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Payment session is not completed',
      );

    session.startTransaction();

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { status: PAYMENT_STATUS.paid, paymentIntentId },
      { new: true, session },
    ).populate([
      { path: 'user', select: 'name _id email phoneNumber profile' },
      { path: 'vendor', select: 'name _id email phoneNumber profile' },
    ]);

    if (!payment) throw new AppError(httpStatus.NOT_FOUND, 'Payment not found');

    let referenceDoc: any;
    if (payment.modelType === 'Order') {
      referenceDoc = await Order.findByIdAndUpdate(
        payment.reference,
        { status: 'ongoing', tnxId: payment.trnId, isPaid: true },
        { new: true, session },
      );

      for (const p of referenceDoc.products) {
        await Product.findByIdAndUpdate(
          p.product,
          { $inc: { stock: -p.quantity, totalSell: p.quantity } },
          { session },
        );
      }
    } else if (payment.modelType === 'Booking') {
      referenceDoc = await Booking.findByIdAndUpdate(
        payment.reference,
        { status: 'confirmed', isPaid: true },
        { new: true, session },
      );
    }

    await User.findByIdAndUpdate(
      payment.vendor,
      { $inc: { balance: payment.vendorAmount } },
      { session },
    );

    await session.commitTransaction();
    return payment;
  } catch (error: any) {
    await session.abortTransaction();
    if (sessionId) {
      try {
        await StripePaymentService.refund(sessionId);
      } catch (refundError: any) {
        console.error('Refund error:', refundError.message);
      }
    }
    throw new AppError(httpStatus.BAD_GATEWAY, error.message);
  } finally {
    session.endSession();
  }
};

export const PaymentService = { createPayment, confirmPayment };
