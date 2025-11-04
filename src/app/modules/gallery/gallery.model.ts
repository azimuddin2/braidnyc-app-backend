import { Schema, model } from 'mongoose';
import { TGallery } from './gallery.interface';

const imageSchema = new Schema(
  {
    url: { type: String, required: true },
    key: { type: String, required: true },
  },
  { _id: false },
);

const gallerySchema = new Schema<TGallery>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User Id is required'],
      ref: 'User',
    },
    deleteKey: [{ type: String, required: true }],
    images: {
      type: [imageSchema],
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Gallery = model<TGallery>('Gallery', gallerySchema);
