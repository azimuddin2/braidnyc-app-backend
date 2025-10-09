import { Model, Types } from 'mongoose';
import { TPlan } from '../plan/plan.interface';
import { TUser } from '../user/user.interface';

export type TSubscriptionStatus = 'active' | 'expired' | 'canceled' | 'pending';

export type TSubscription = {
  _id?: Types.ObjectId;
  user: Types.ObjectId | TUser;
  plan: Types.ObjectId | TPlan;
  durationType: 'monthly' | 'yearly';
  isPaid: boolean;
  amount: number;
  code?: string;
  status: TSubscriptionStatus;
  startedAt: Date;
  expiredAt: Date;
  isExpired: boolean;
  isDeleted: boolean;
};

export type TSubscriptionModel = Model<TSubscription, Record<string, unknown>>;
