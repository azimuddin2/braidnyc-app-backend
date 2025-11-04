import { Types } from 'mongoose';

export type TReview = {
  _id?: string;
  user: Types.ObjectId;
  service: Types.ObjectId;
  comment: string;
  rating: number;
};
