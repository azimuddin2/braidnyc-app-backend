import { Types } from 'mongoose';

export type TSubcategory = {
  _id?: string;
  category: Types.ObjectId;
  name: string;
  slug: string;
  image: string | null;
  isDeleted: boolean;
};
