import mongoose, { startSession } from 'mongoose';
import { Payment } from './payment.model';
import { User } from '../user/user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import config from '../../config';
import StripePaymentService from '../../class/stripe';
import QueryBuilder from '../../builder/QueryBuilder';
import { TPayment } from './payment.interface';
import { Booking } from '../booking/booking.model';
import { BookingServices } from '../booking/booking.service';
import { TBooking } from '../booking/booking.interface';

// 🔹 Helper → calculate commission split (10% admin, 90% vendor)
const calculateAmounts = (price: number) => ({
  adminAmount: price * 0.1,
  vendorAmount: price * 0.9,
});

const createPayment = async (payload: any) => {
  const session = await startSession();
  session.startTransaction();

  try {
    // STEP 1 — VALIDATED BOOKING CREATION
    const bookingPayload: any = {
      customer: payload.customer,
      vendor: payload.vendor,
      service: payload.service,
      serviceType: payload.serviceType,
      onServices: payload.onServices,
      email: payload.email,
      date: payload.date,
      time: payload.time,
      duration: payload.duration,
      specialist: payload.specialist,
      serviceLocation: payload.serviceLocation,
      image: payload.image,
      notes: payload.notes,
      totalPrice: payload.totalPrice,
    };

    const booking = await BookingServices.createBookingIntoDB(
      bookingPayload,
      session,
    );

    if (!booking) throw new AppError(400, 'Booking creation failed');

    // STEP 2 — Prevent Duplicate Payments
    const existingPaid = await Payment.findOne({
      booking: booking._id,
      status: 'paid',
      isDeleted: false,
    }).session(session);

    if (existingPaid) {
      throw new AppError(400, 'Payment already completed for this booking');
    }

    // STEP 3 — Create Payment
    const trnId = Math.random().toString(36).substring(2, 12);
    const { adminAmount, vendorAmount } = calculateAmounts(booking.totalPrice);

    const payment = await Payment.create(
      [
        {
          user: payload.customer,
          vendor: payload.vendor,
          booking: booking._id,
          trnId,
          price: booking.totalPrice,
          adminAmount,
          vendorAmount,
        },
      ],
      { session },
    ).then((docs) => docs[0]);

    if (!payment) {
      throw new AppError(400, 'Payment creation failed');
    }

    // STEP 4 — STRIPE CUSTOMER
    const user = await User.findById(payload.customer).session(session);
    if (!user) throw new AppError(404, 'User not found');

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await StripePaymentService.createCustomer(
        user.email!,
        user.fullName!,
      );
      customerId = customer.id;

      await User.findByIdAndUpdate(
        user._id,
        { stripeCustomerId: customerId },
        { session },
      );
    }

    // STEP 5 — Stripe Line Item
    const lineItems: any = [
      {
        price_data: {
          currency: config.currency,
          product_data: { name: 'Service Booking Payment' },
          unit_amount: Math.round(booking.totalPrice * 100),
        },
        quantity: 1,
      },
    ];

    // STEP 6 — SUCCESS/CANCEL URLs
    const successUrl = `${config.server_url}/payments/confirm-payment?sessionId={CHECKOUT_SESSION_ID}&paymentId=${payment._id}`;
    const cancelUrl = `${config.server_url}/payments/cancel?paymentId=${payment._id}`;

    // STEP 7 — Create Checkout Session
    const checkoutSession = await StripePaymentService.getCheckoutSession(
      lineItems,
      successUrl,
      cancelUrl,
      config.currency,
      customerId,
    );

    await session.commitTransaction();

    return {
      checkoutUrl: checkoutSession?.url,
      bookingId: booking._id,
      paymentId: payment._id,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const confirmPayment = async (query: Record<string, any>) => {
  const { sessionId, paymentId } = query;
  const session = await startSession();

  try {
    // STEP 1 — Get Stripe session info
    const paymentSession =
      await StripePaymentService.getPaymentSession(sessionId);

    const paymentIntentId = paymentSession.payment_intent as string;

    const isPaid = await StripePaymentService.isPaymentSuccess(sessionId);

    if (!isPaid) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Payment session is not completed',
      );
    }

    session.startTransaction();

    // STEP 2 — Update Payment status → paid
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        status: 'paid',
        paymentIntentId,
      },
      { new: true, session },
    ).populate([
      { path: 'user', select: 'name _id email phoneNumber profile' },
      { path: 'vendor', select: 'name _id email phoneNumber profile' },
    ]);

    if (!payment) {
      throw new AppError(httpStatus.NOT_FOUND, 'Payment not found');
    }

    // STEP 3 — Update Booking status → confirmed
    const booking = await Booking.findByIdAndUpdate(
      payment.booking,
      {
        status: 'confirmed',
        paymentStatus: 'paid',
      },
      { new: true, session },
    );

    if (!booking) {
      throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
    }

    // STEP 4 — Increment vendor balance
    await User.findByIdAndUpdate(
      payment.vendor,
      {
        $inc: { balance: payment.vendorAmount },
      },
      { session },
    );

    await session.commitTransaction();

    return {
      message: 'Payment confirmed successfully',
      payment,
      booking,
    };
  } catch (error: any) {
    await session.abortTransaction();

    // Auto-refund if something goes wrong
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

const getAllPaymentFromDB = async (query: Record<string, unknown>) => {
  const { vendor, ...filters } = query;

  if (!vendor || !mongoose.Types.ObjectId.isValid(vendor as string)) {
    throw new AppError(400, 'Invalid Vendor ID');
  }

  // Base query -> always exclude deleted payments
  let paymentQuery = Payment.find({ vendor, isDeleted: false })
    .populate('vendor')
    .populate('user');

  const queryBuilder = new QueryBuilder(paymentQuery, filters)
    .search([''])
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await queryBuilder.countTotal();
  const result = await queryBuilder.modelQuery;

  return { meta, result };
};

export const PaymentService = {
  createPayment,
  confirmPayment,
  getAllPaymentFromDB,
};
