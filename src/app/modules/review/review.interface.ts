import { Types } from 'mongoose';

export type TReview = {
  _id?: string;
  user: Types.ObjectId; // who wrote the review
  freelancer?: Types.ObjectId; // target freelancer
  owner?: Types.ObjectId; // target owner
  comment: string;
  rating: number;
  isDeleted: boolean;
};
