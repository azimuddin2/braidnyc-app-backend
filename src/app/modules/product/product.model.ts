import { model, Schema } from 'mongoose';
import { TProduct } from './product.interface';
import { ProductStatus } from './product.constant';

const productSchema = new Schema<TProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    images: {
      type: [
        {
          url: { type: String, required: true },
          key: { type: String, required: true },
        },
      ],
      required: true,
    },
    productType: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },
    colors: {
      type: [String],
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ProductStatus,
        message: '{VALUE} is not valid',
      },
      default: 'Available',
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Product = model<TProduct>('Product', productSchema);
