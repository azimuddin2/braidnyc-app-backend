import { ClientSession, startSession, Types } from 'mongoose';
import { TReview } from './review.interface';
import { Review } from './review.model';
import AppError from '../../errors/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { FreelancerRegistration } from '../freelancerRegistration/freelancerRegistration.model';
import { OwnerRegistration } from '../ownerRegistration/ownerRegistration.model';

const createReviewIntoDB = async (payload: TReview, userId: string) => {
  const session: ClientSession = await startSession();
  session.startTransaction();

  try {
    payload.user = new Types.ObjectId(userId);

    // 1️⃣ Create the review
    const [review] = await Review.create([payload], { session });
    if (!review) throw new AppError(400, 'Failed to create review');

    // 2️⃣ Determine target model and ID
    let targetId: string;
    let targetModel: any;

    if (review.freelancer) {
      targetId = review.freelancer.toString();
      targetModel = FreelancerRegistration;
    } else if (review.owner) {
      targetId = review.owner.toString();
      targetModel = OwnerRegistration;
    } else {
      throw new AppError(400, 'Review must belong to a freelancer or owner');
    }

    // 3️⃣ Calculate avgRating
    const filter = review.freelancer
      ? { freelancer: targetId }
      : { owner: targetId };

    const allReviews = await Review.find(filter).session(session);

    const avgRating =
      allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0;

    const avgRatingRounded = Math.round(avgRating * 10) / 10;

    // 4️⃣ Use findByIdAndUpdate with session for reliability
    await targetModel.findByIdAndUpdate(
      targetId,
      {
        avgRating: avgRatingRounded,
        $addToSet: { reviews: review._id },
      },
      { session, new: true },
    );

    // 5️⃣ Commit transaction
    await session.commitTransaction();
    session.endSession();

    return { review, avgRating: avgRatingRounded };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(400, error?.message || 'Review creation failed');
  }
};

const getAllReviewsFromDB = async (query: Record<string, any>) => {
  const { freelancer, owner, ...restQuery } = query;

  // ❌ Require either freelancer or owner
  if (!freelancer && !owner) {
    throw new AppError(400, 'Freelancer ID or Owner ID is required');
  }

  // Base filter
  const filter: Record<string, any> = { isDeleted: false };

  if (freelancer) filter.freelancer = freelancer;
  if (owner) filter.owner = owner;

  const reviewsModel = new QueryBuilder(Review.find(filter), restQuery)
    .search(['comment'])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await reviewsModel.modelQuery;
  const meta = await reviewsModel.countTotal();

  return {
    data,
    meta,
  };
};

export const ReviewService = {
  createReviewIntoDB,
  getAllReviewsFromDB,
};
