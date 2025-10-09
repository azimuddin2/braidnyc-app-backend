import { Model, ObjectId } from 'mongoose';
import { TUser } from '../user/user.interface';
import { TSubscription } from '../subscription/subscription.interface';

export interface TSubPayment {
  _id: ObjectId;
  user: ObjectId | TUser;
  plan: ObjectId;
  subscription?: ObjectId | TSubscription;
  durationType: 'monthly' | 'yearly';
  amount: number;
  tranId: string;
  isPaid: boolean;
  paidAt: Date;
  isDeleted: boolean;
}

export type ISubscriptionsModel = Model<TSubPayment, Record<string, unknown>>;
