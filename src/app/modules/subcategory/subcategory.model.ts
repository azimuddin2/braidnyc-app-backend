import mongoose, { model, Schema } from 'mongoose';
import { TSubcategory } from './subcategory.interface';

const SubcategorySchema = new Schema<TSubcategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
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

export const Subcategory = model<TSubcategory>(
  'Subcategory',
  SubcategorySchema,
);
