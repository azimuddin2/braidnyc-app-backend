export type TImage = {
  url: string;
  key: string;
};

export type TTimeSlot = {
  date: string;
  day: string; // e.g., "Monday"
  startTime?: string; // e.g., "09:00 AM"
  endTime?: string; // e.g., "05:00 PM"
  seatCapacity?: number;
  isClosed?: boolean;
};

export type THolidaySlot = {
  date: string; // ISO string, e.g., "2025-05-10"
  startTime?: string;
  endTime?: string;
  seatCapacity?: number;
  isClosed?: boolean;
};

export type TPackages = {
  deleteKey: string[];
  _id?: string;
  name: string;
  serviceType: string;
  duration: string; // "30 minutes", "1 hour", etc.
  price: number;
  discountPrice?: number;
  status?: 'available' | 'unavailable';
  description?: string;

  images: TImage[];

  weeklySchedule: TTimeSlot[];
  holidaySlots?: THolidaySlot[];

  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
};
