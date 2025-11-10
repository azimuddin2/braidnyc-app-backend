import { model, Schema } from 'mongoose';
import { TSubcategory } from './subcategory.interface';

const SubcategorySchema = new Schema<TSubcategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    image: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Subcategory = model<TSubcategory>('Category', SubcategorySchema);
