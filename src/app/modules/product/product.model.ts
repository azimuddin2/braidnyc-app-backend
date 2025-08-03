import { model, Schema } from 'mongoose';
import { TProduct } from './product.interface';
import { ProductStatus } from './product.constant';

const imageSchema = new Schema(
  {
    url: { type: String, required: true },
    key: { type: String, required: true },
  },
  { _id: false },
);

const productSchema = new Schema<TProduct>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User Id is required'],
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    images: {
      type: [imageSchema],
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Product = model<TProduct>('Product', productSchema);
