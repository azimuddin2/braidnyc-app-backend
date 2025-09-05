import AppError from '../../errors/AppError';
import { Booking } from './booking.model';
import { Packages } from '../packages/packages.model';
import { TBooking } from './booking.interface';
import { TWeekDay } from '../packages/packages.interface';

const createBookingIntoDB = async (payload: TBooking) => {
  const { service, serviceName, date, time } = payload;

  // 1️⃣ Fetch the service
  const serviceData = await Packages.findById(service).lean();
  if (!serviceData) throw new AppError(404, 'Service not found');

  // 2️⃣ Check day availability
  const dayOfWeek = new Date(date)
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase() as TWeekDay;

  const schedule = serviceData.availability?.weeklySchedule?.[dayOfWeek];
  if (!schedule?.enabled)
    throw new AppError(400, 'Service not available on this day');

  // 3️⃣ Attempt to create booking
  try {
    const booking = await Booking.create(payload);
    return booking;
  } catch (err: any) {
    // 4️⃣ Duplicate key → slot already booked
    if (err.code === 11000) {
      throw new AppError(409, 'This time slot is already booked');
    }
    throw new AppError(400, 'Failed to create booking');
  }
};

export const BookingServices = {
  createBookingIntoDB,
};
