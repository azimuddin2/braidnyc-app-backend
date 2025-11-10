import { Types } from 'mongoose';
import { TSubcategory } from '../subcategory/subcategory.interface';

export type TCategory = {
  _id?: string;
  name: string;
  slug: string;
  image: string | null;
  subcategories?: TSubcategory[] | Types.ObjectId[];
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
};
