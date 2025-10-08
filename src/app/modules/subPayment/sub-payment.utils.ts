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
  console.log('createCheckoutSession payload', payload);

  // ✅ Create checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: payload?.product?.name,
          },
          unit_amount: Math.round(payload.product?.amount * 100),
        },
        quantity: payload.product?.quantity,
      },
    ],
    mode: 'payment',
    invoice_creation: {
      enabled: true,
    },
    payment_method_types: ['card'],
    success_url: `${config.server_url}/sub-payments/confirm-sub-payment?sessionId={CHECKOUT_SESSION_ID}&paymentId=${payload.paymentId}`,
    cancel_url: config.client_Url,
  });

  console.log('session', session);

  return session;
};
