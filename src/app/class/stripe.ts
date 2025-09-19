// stripe.ts
import { Stripe as StripeType } from 'stripe';
import config from '../config';

interface IProduct {
  amount: number;
  name: string;
  quantity: number;
}

class StripeService {
  private stripe() {
    return new StripeType(config.stripe?.stripe_api_secret as string, {
      apiVersion: '2024-06-20',
      typescript: true,
    });
  }

  private handleError(error: unknown, message: string): never {
    if (error instanceof StripeType.errors.StripeError) {
      console.error('Stripe Error:', error.message);
      throw new Error(`Stripe Error: ${message} - ${error.message}`);
    } else if (error instanceof Error) {
      console.error('Error:', error.message);
      throw new Error(`${message} - ${error.message}`);
    } else {
      console.error('Unknown Error:', error);
      throw new Error(`${message} - An unknown error occurred.`);
    }
  }

  public async createCustomer(email: string, name: string) {
    try {
      return await this.stripe().customers.create({
        email,
        name: String(name),
      });
    } catch (error) {
      this.handleError(error, 'Customer creation failed');
    }
  }

  public async getCheckoutSession(
    products: IProduct[] | IProduct,
    success_url: string,
    cancel_url: string,
    currency: string = 'usd',
    customer: string = '',
    payment_method_types: Array<'card' | 'paypal' | 'ideal'> = ['card'],
  ) {
    try {
      const items = Array.isArray(products) ? products : [products];
      const line_items = items.map((p) => ({
        price_data: {
          currency,
          product_data: { name: String(p.name || 'Product') },
          unit_amount: Math.round(Number(p.amount || 0) * 100),
        },
        quantity: Math.max(1, Number(p.quantity) || 1),
      }));

      return await this.stripe().checkout.sessions.create({
        line_items,
        mode: 'payment',
        success_url,
        cancel_url,
        customer,
        payment_method_types,
        invoice_creation: { enabled: true },
      });
    } catch (error) {
      this.handleError(error, 'Error creating checkout session');
    }
  }

  public async refund(payment_intent: string, amount?: number) {
    try {
      return await this.stripe().refunds.create({
        payment_intent,
        ...(amount ? { amount: Math.round(Number(amount) * 100) } : {}),
      });
    } catch (error) {
      this.handleError(error, 'Error processing refund');
    }
  }

  public async getPaymentSession(session_id: string) {
    try {
      return await this.stripe().checkout.sessions.retrieve(session_id);
    } catch (error) {
      this.handleError(error, 'Error retrieving payment session');
    }
  }

  public async isPaymentSuccess(session_id: string) {
    try {
      const session =
        await this.stripe().checkout.sessions.retrieve(session_id);
      return session.payment_status === 'paid';
    } catch (error) {
      this.handleError(error, 'Error checking payment status');
    }
  }
}

const StripePaymentService = new StripeService();
export default StripePaymentService;
