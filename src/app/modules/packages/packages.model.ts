import { Schema, model } from 'mongoose';
import {
  TDaySchedule,
  THolidaySchedule,
  TPackages,
  TServicePricing,
} from './packages.interface';
import { HighlightStatus } from './packages.constant';

const ServicePricingSchema = new Schema<TServicePricing>(
  {
    id: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: String, required: true },
    discount: { type: String },
    finalPrice: { type: String, required: true },
  },
  { _id: false },
);

const DayScheduleSchema = new Schema<TDaySchedule>(
  {
    enabled: { type: Boolean, required: true, default: false },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    seats: { type: Number, required: true, default: 1 },
  },
  { _id: false },
);

const HolidayScheduleSchema = new Schema<THolidaySchedule>(
  {
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    seats: { type: Number, required: true },
  },
  { _id: false },
);

const packagesSchema = new Schema<TPackages>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    deleteKey: [{ type: String, required: true }],
    name: { type: String, required: true },
    type: { type: String, required: true },
    savedServices: { type: [ServicePricingSchema], required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ['available', 'unavailable'],
      default: 'available',
    },
    highlightStatus: {
      type: String,
      enum: {
        values: HighlightStatus,
        message: '{VALUE} is not valid',
      },
      default: 'Highlight',
    },
    availability: {
      weeklySchedule: {
        type: Map,
        of: DayScheduleSchema,
        default: {},
      },
      holidays: { type: [HolidayScheduleSchema], default: [] },
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Packages = model('Packages', packagesSchema);
