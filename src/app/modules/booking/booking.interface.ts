import { Types } from 'mongoose';

export type TBooking = {
  serviceId: string; // ID of the service booked
  userId: Types.ObjectId; // ID of the user who booked
  date: string; // Booking date (YYYY-MM-DD)
  time: string; // Booking time slot ("09:00 AM")
  packageId?: string; // Optional: which package/duration booked
  status: 'pending' | 'confirmed' | 'cancelled'; // Booking status
  createdAt: Date;
  updatedAt: Date;
};
