import { Types } from 'mongoose';

export type THighlightStatus = 'Highlighted' | 'Highlight';

export type TStatus = 'available' | 'unavailable';

export type TServicePricing = {
  id: string;
  duration: string;
  price: string;
  discount: string;
  finalPrice: string;
};

// Define a Day type (strict union instead of free string)
export type TWeekDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

// Schedule structure for a single day
export type TDaySchedule = {
  enabled: boolean;
  startTime: string; // e.g., "09:00"
  endTime: string; // e.g., "17:00"
  seats: number;
};

// Holiday schedule (for exceptions)
export type THolidaySchedule = {
  date: string; // ISO date string "2025-08-20"
  startTime: string; // e.g., "10:00"
  endTime: string; // e.g., "14:00"
  seats: number;
};

export type TImage = {
  url: string;
  key: string;
};

// Main ServiceData type
export type TPackages = {
  user: Types.ObjectId;
  deleteKey: string[];
  _id?: string;
  name: string;
  type: string;
  savedServices: TServicePricing[];
  description: string; // optional
  images: TImage[];
  status?: TStatus;
  highlightStatus: THighlightStatus;

  availability: {
    weeklySchedule: Partial<Record<TWeekDay, TDaySchedule>>; // not all days required
    holidays?: THolidaySchedule[]; // optional
  };

  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
};
