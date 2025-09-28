import mongoose, { Schema } from 'mongoose';
import { TAbout } from './about.interface';

const aboutSchema = new Schema<TAbout>(
  {
    description: {
      type: String,
      required: [true, 'About Description is required'],
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

export const About = mongoose.model<TAbout>('About', aboutSchema);
