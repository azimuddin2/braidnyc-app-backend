import { Types } from 'mongoose';

export type TReview = {
  _id?: string;
  user: Types.ObjectId;
  product?: Types.ObjectId;
  service?: Types.ObjectId;
  review: string;
  rating: number;
};
