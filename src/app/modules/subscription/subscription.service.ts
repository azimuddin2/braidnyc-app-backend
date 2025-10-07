import { Types } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { Plan } from '../plan/plan.model';
import { USER_ROLE } from '../user/user.constant';
import { User } from '../user/user.model';
import { TSubscription } from './subscription.interface';
import { Subscription } from './subscription.model';
import httpStatus from 'http-status';

export const createSubscriptionIntoDB = async (payload: TSubscription) => {
  // 1️⃣ Check if the user already has an unpaid subscription for the same plan
  const existing = await Subscription.findOne({
    user: payload.user,
    plan: payload.plan,
    isPaid: false,
    isDeleted: false,
  });

  if (existing) return existing;

  // 2️⃣ Fetch the plan
  const plan = await Plan.findById(payload.plan);
  if (!plan) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Plan not found.');
  }

  // 3️⃣ Fetch the user
  const user = await User.findById(payload.user);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
  }

  // 4️⃣ Only vendors can subscribe
  if (user.role !== USER_ROLE.vendor) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Only vendors can subscribe to plans.',
    );
  }

  // 5️⃣ Calculate subscription expiry based on plan validity
  const now = new Date();
  const expiredAt = new Date(now);

  switch (plan.validity.type) {
    case '1month':
      expiredAt.setMonth(now.getMonth() + 1);
      break;
    case '3month':
      expiredAt.setMonth(now.getMonth() + 3);
      break;
    case '6month':
      expiredAt.setMonth(now.getMonth() + 6);
      break;
    case 'unlimited':
      expiredAt.setFullYear(now.getFullYear() + 100); // effectively never expires
      break;
    case 'custom':
      if (!plan.validity.durationInMonths) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Custom validity requires durationInMonths.',
        );
      }

      // Convert string to number
      const duration = parseInt(plan.validity.durationInMonths, 10);
      if (isNaN(duration) || duration <= 0) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Invalid durationInMonths value.',
        );
      }

      expiredAt.setMonth(now.getMonth() + duration);
      break;
  }

  // 6️⃣ Create subscription
  const subscriptionPayload: TSubscription = {
    ...payload,
    amount: plan.cost, // use plan cost as final price
    startedAt: now,
    expiredAt,
    status: 'active', // default status
    isPaid: true,
    isExpired: false,
    isDeleted: false,
  };

  const result = await Subscription.create(subscriptionPayload);

  if (!result) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create subscription.',
    );
  }

  return result;
};

const getAllSubscriptionFromDB = async (query: Record<string, unknown>) => {
  const subscriptionsModel = new QueryBuilder(Subscription.find(), query)
    .search([])
    .filter()
    .paginate()
    .sort()
    .fields();

  const result = await subscriptionsModel.modelQuery;
  const meta = await subscriptionsModel.countTotal();
  return {
    result,
    meta,
  };
};

const getSubscriptionByIdFromDB = async (id: string) => {
  const result = await Subscription.findById(id).populate(['plan', 'user']);
  return result;
};

// My subscription
const getSubscriptionByUserIdFromDB = async (id: string) => {
  const result = await Subscription.findOne({
    user: new Types.ObjectId(id),
  })
    .populate('package')
    .populate('user', 'email');

  return result;
};

const updateSubscriptionIntoDB = async (
  id: string,
  payload: Partial<TSubscription>,
) => {
  const result = await Subscription.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new Error('Failed to update subscription');
  }
  return result;
};

const deleteSubscriptionFromDB = async (id: string) => {
  const result = await Subscription.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new Error('Failed to delete subscription');
  }
  return result;
};

export const SubscriptionService = {
  createSubscriptionIntoDB,
  getAllSubscriptionFromDB,
  getSubscriptionByIdFromDB,
  getSubscriptionByUserIdFromDB,
  updateSubscriptionIntoDB,
  deleteSubscriptionFromDB,
};
