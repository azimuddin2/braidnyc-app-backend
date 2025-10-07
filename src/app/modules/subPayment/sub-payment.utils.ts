import Stripe from 'stripe';
import config from '../../config';
import { Types } from 'mongoose';

const stripe: Stripe = new Stripe(config.stripe_api_secret as string, {
  apiVersion: '2025-08-27.basil',
  typescript: true,
});

interface IPayload {
  product: {
    amount: number;
    name: string;
    quantity: number;
  };
  paymentId: Types.ObjectId;
  durationType?: string;
}

export const createCheckoutSession = async (payload: IPayload) => {
  // console.log('createCheckoutSession payload', payload);

  const unitAmount = Math.round(payload.product.amount * 100);

  // Normalize duration types
  const validIntervals: Record<string, 'month' | 'year'> = {
    monthly: 'month',
    month: 'month',
    yearly: 'year',
    year: 'year',
  };

  const interval = payload?.durationType
    ? validIntervals[payload.durationType.toLowerCase()]
    : undefined;

  const isSubscription = !!interval;

  // ✅ Construct price data safely
  const priceData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData = {
    currency: 'usd',
    product_data: {
      name: payload.product.name || 'Sponsor',
    },
    unit_amount: unitAmount,
    ...(isSubscription && {
      recurring: {
        interval,
      },
    }),
  };
  // console.log('priceData____', priceData);

  // ✅ Create checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: priceData,
        quantity: payload.product.quantity,
      },
    ],
    mode: isSubscription ? 'subscription' : 'payment',
    payment_method_types: ['card'],
    success_url: `${config.server_url}/payments/confirm-payment?sessionId={CHECKOUT_SESSION_ID}&paymentId=${payload.paymentId}`,
    cancel_url: config.client_Url,
  });

  return session;
};
