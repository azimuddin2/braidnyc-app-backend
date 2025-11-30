import { Schema, model } from 'mongoose';
import { TAnnouncement } from './announcement.interface';

const imageSchema = new Schema(
  {
    url: { type: String, required: true },
    key: { type: String, required: true },
  },
  { _id: false },
);

const announcementSchema = new Schema<TAnnouncement>(
  {
    deleteKey: [{ type: String, required: true }],
    images: {
      type: [imageSchema],
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Announcement = model<TAnnouncement>(
  'Announcement',
  announcementSchema,
);
