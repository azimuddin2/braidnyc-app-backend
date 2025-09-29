import { model, Schema } from 'mongoose';
import { TProductType } from './productType.interface';

const productTypeSchema = new Schema<TProductType>(
  {
    name: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const ProductType = model<TProductType>(
  'ProductType',
  productTypeSchema,
);
