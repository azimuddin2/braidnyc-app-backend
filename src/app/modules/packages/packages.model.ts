import { Schema, model } from 'mongoose';
import { TPackages } from './packages.interface';

const imageSchema = new Schema(
  {
    url: { type: String, required: true },
    key: { type: String, required: true },
  },
  { _id: false },
);

const timeSlotSchema = new Schema(
  {
    date: { type: String, required: true },
    day: { type: String, required: true },
    startTime: { type: String },
    endTime: { type: String },
    seatCapacity: { type: Number },
    isClosed: { type: Boolean, default: false },
  },
  { _id: false },
);

const holidaySlotSchema = new Schema(
  {
    date: { type: String, required: true },
    startTime: { type: String },
    endTime: { type: String },
    seatCapacity: { type: Number },
    isClosed: { type: Boolean, default: false },
  },
  { _id: false },
);

const packagesSchema = new Schema<TPackages>(
  {
    name: { type: String, required: true },
    serviceType: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: null },
    status: {
      type: String,
      enum: ['available', 'unavailable'],
      default: 'available',
    },
    description: { type: String },

    images: {
      type: [imageSchema],
      required: true,
    },

    weeklySchedule: {
      type: [timeSlotSchema],
      required: true,
    },

    holidaySlots: {
      type: [holidaySlotSchema],
      default: [],
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Packages = model('Packages', packagesSchema);
