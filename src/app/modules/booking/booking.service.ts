import { Types } from 'mongoose';
import AppError from '../../errors/AppError';
import { Booking } from './booking.model';
import { Packages } from '../packages/packages.model';
import { TBooking } from './booking.interface';
import { TWeekDay } from '../packages/packages.interface';

const createBookingIntoDB = async (payload: TBooking) => {
  const { service, serviceItemId, date, time } = payload;

  // 1️⃣ Validate service ObjectId
  if (!Types.ObjectId.isValid(service))
    throw new AppError(400, 'Invalid service ID');

  // 2️⃣ Fetch service
  const serviceData = await Packages.findById(service).lean();
  if (!serviceData) throw new AppError(404, 'Service not found');

  // 3️⃣ Check day schedule
  const dayOfWeek = new Date(date)
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase() as TWeekDay;

  const schedule = serviceData.availability?.weeklySchedule?.[dayOfWeek];
  if (!schedule?.enabled)
    throw new AppError(400, 'Service not available on this day');

  // 4️⃣ Validate slot within schedule
  const parseTimeToMinutes = (str: string) => {
    const [t, modifier] = str.split(' ');
    const [h, m] = t.split(':').map(Number);
    let hours = h + (modifier === 'PM' && h !== 12 ? 12 : 0);
    if (modifier === 'AM' && h === 12) hours = 0;
    return hours * 60 + (m || 0);
  };

  const [slotStartStr, slotEndStr] = time.split(' - ');
  const slotStart = parseTimeToMinutes(slotStartStr);
  const slotEnd = parseTimeToMinutes(slotEndStr);
  const scheduleStart = parseTimeToMinutes(schedule.startTime);
  const scheduleEnd = parseTimeToMinutes(schedule.endTime);

  if (slotStart < scheduleStart || slotEnd > scheduleEnd) {
    throw new AppError(400, 'Selected time is outside service working hours');
  }

  // 5️⃣ Check if slot is already booked
  const existingBooking = await Booking.findOne({
    service,
    serviceItemId,
    date,
    slotTime: time,
  }).lean();

  if (existingBooking)
    throw new AppError(409, 'This time slot is already booked');

  // 6️⃣ Create booking
  const booking = await Booking.create(payload);

  return booking;
};

export const BookingServices = {
  createBookingIntoDB,
};
