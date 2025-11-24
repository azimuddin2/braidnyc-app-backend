import AppError from '../../errors/AppError';
import { Booking } from './booking.model';
import { TBooking } from './booking.interface';
import { User } from '../user/user.model';
import { OwnerService } from '../ownerService/ownerService.model';
import { FreelancerService } from '../freelancerService/freelancerService.model';

export const createBookingIntoDB = async (payload: TBooking, session?: any) => {
  const {
    customer,
    service,
    vendor,
    date,
    time,
    specialist,
    duration,
    serviceType,
  } = payload;

  const customerExists = await User.findById(customer);
  if (!customerExists) throw new AppError(404, 'Customer does not exist');

  const vendorExists = await User.findById(vendor);
  if (!vendorExists) throw new AppError(404, 'Vendor does not exist');

  let serviceExists;
  if (serviceType === 'OwnerService') {
    serviceExists = await OwnerService.findById(service);
  } else if (serviceType === 'FreelancerService') {
    serviceExists = await FreelancerService.findById(service);
  } else {
    throw new AppError(400, 'Invalid service type');
  }

  if (!serviceExists) throw new AppError(404, 'Service does not exist');

  const durationMinutes = Number(duration) * 60;

  const parseToMinutes = (t: string) => {
    let [timeStr, mod] = t.split(' ');
    let [h, m] = timeStr.split(':').map(Number);
    m = m || 0;

    if (mod) {
      if (mod === 'PM' && h !== 12) h += 12;
      if (mod === 'AM' && h === 12) h = 0;
    }
    return h * 60 + m;
  };

  const [slotStartStr] = time.split(' - ');
  const slotStart = parseToMinutes(slotStartStr);
  const slotEnd = slotStart + durationMinutes;

  // Specialist conflict
  if (specialist) {
    const conflict = await Booking.findOne({
      specialist,
      date,
      isDeleted: false,
      $or: [
        {
          $and: [
            { slotStart: { $lt: slotEnd } },
            { slotEnd: { $gt: slotStart } },
          ],
        },
      ],
    });

    if (conflict)
      throw new AppError(409, 'Specialist is not available for this duration');
  }

  payload.slotStart = slotStart;
  payload.slotEnd = slotEnd;

  // 👇👇 IMPORTANT PART — session support
  const booking = await Booking.create([payload], { session }).then(
    (d) => d[0],
  );

  return booking;
};

// const getAllBookingByUserFromDB = async (query: Record<string, unknown>) => {
//   const { vendor, requestType, ...filters } = query;

//   if (!vendor || !mongoose.Types.ObjectId.isValid(vendor as string)) {
//     throw new AppError(400, 'Invalid Vendor ID');
//   }

//   // Base query -> always exclude deleted service
//   let bookingQuery = Booking.find({ vendor, isDeleted: false })
//     .populate('vendor')
//     .populate('service');

//   // ✅ Custom filter for booking request type (cancel | reschedule)
//   if (requestType && ['cancel', 'reschedule'].includes(requestType as string)) {
//     bookingQuery = bookingQuery.find({ 'request.type': requestType });
//   }

//   const queryBuilder = new QueryBuilder(bookingQuery, filters)
//     .search(bookingSearchableFields)
//     .filter()
//     .sort()
//     .paginate()
//     .fields();

//   const meta = await queryBuilder.countTotal();
//   const result = await queryBuilder.modelQuery;

//   return { meta, result };
// };

// const getBookingAppointmentsFromDB = async (query: Record<string, unknown>) => {
//   const { vendor, date, ...filters } = query;

//   if (!vendor || !mongoose.Types.ObjectId.isValid(vendor as string)) {
//     throw new AppError(400, 'Invalid Vendor ID');
//   }

//   // Base query
//   const bookingQuery: any = { vendor, isDeleted: false };

//   // Filter by date if provided
//   if (date) {
//     bookingQuery.date = date;
//   }

//   // Apply other dynamic filters
//   Object.assign(bookingQuery, filters);

//   // Fetch bookings
//   const bookings = await Booking.find(bookingQuery)
//     .populate('vendor')
//     .populate('service');

//   return bookings;
// };

// const getBookingsByEmailFromDB = async (email: string) => {
//   // ✅ Validate email
//   if (!email) {
//     throw new AppError(400, 'Email is required');
//   }

//   // ✅ Fetch bookings directly by email
//   const bookings = await Booking.find({ email, isDeleted: false })
//     .populate('service')
//     .populate('vendor')
//     .sort({ createdAt: -1 }) // latest first
//     .select('-__v -isDeleted'); // exclude unwanted fields

//   return bookings;
// };

// const getBookingByIdFromDB = async (id: string) => {
//   const result = await Booking.findById(id).populate('service');

//   if (!result) {
//     throw new AppError(404, 'This Booking not found');
//   }

//   if (result.isDeleted === true) {
//     throw new AppError(400, 'This Booking has been deleted');
//   }

//   return result;
// };

// const updateBookingRequestIntoDB = async (
//   bookingId: string,
//   payload: TBooking,
// ) => {
//   // 1️⃣ Validate booking ID
//   if (!Types.ObjectId.isValid(bookingId)) {
//     throw new AppError(400, 'Invalid booking ID');
//   }

//   // 2️⃣ Fetch existing booking
//   const booking = await Booking.findById(bookingId);
//   if (!booking) {
//     throw new AppError(404, 'Booking not found');
//   }

//   // 3️⃣ Update all provided fields
//   for (const key in payload) {
//     if (key === 'request') continue; // handle request separately
//     if (Object.prototype.hasOwnProperty.call(payload, key)) {
//       (booking as any)[key] = (payload as any)[key];
//     }
//   }

//   // 4️⃣ Handle request if provided
//   if (payload.request) {
//     booking.request = {
//       ...payload.request,
//       vendorApproved: false, // always start as not approved
//       updatedAt: new Date(),
//     };

//     // Optional: auto-update status if cancel request is pre-approved
//     if (payload.request.type === 'cancel' && payload.request.vendorApproved) {
//       booking.status = 'cancelled';
//     }
//   }

//   // 5️⃣ Save updated booking
//   await booking.save();

//   await NotificationServices.insertNotificationIntoDB({
//     receiver: booking?.user,
//     message: 'Booking Cancellation Confirmation',
//     description: `Your booking with Name: ${booking.serviceName} has been successfully cancelled. If you have any questions or require further assistance, please contact our support team.`,
//     refference: booking?._id,
//     model_type: ModeType.Booking,
//   });

//   await NotificationServices.insertNotificationIntoDB({
//     receiver: booking?.vendor,
//     message: 'Booking Cancellation Alert',
//     description: `A booking has been cancelled. Booking Name: ${booking.serviceName}. Please update your availability accordingly. If you need further details, please access your management dashboard or contact our support team.`,
//     refference: booking?._id,
//     model_type: ModeType.Booking,
//   });

//   return booking;
// };

// const bookingApprovedRequestIntoDB = async (
//   bookingId: string,
//   vendorApproved: boolean,
// ) => {
//   // 1️⃣ Find the booking
//   const booking = await Booking.findById(bookingId);
//   if (!booking) {
//     throw new AppError(404, 'booking not found');
//   }

//   // 2️⃣ Check if request exists
//   if (!booking.request || booking.request.type === 'none') {
//     throw new AppError(400, 'No request submitted for this booking');
//   }

//   // 3️⃣ Update vendorApproved and updatedAt
//   booking.request.vendorApproved = Boolean(vendorApproved);

//   // 4️⃣ Save the updated booking
//   const updatedBooking = await booking.save();

//   return updatedBooking;
// };

// const bookingAssignedToMemberIntoDB = async (
//   id: string,
//   payload: { assignedTo: string },
// ) => {
//   const isBookingExists = await Booking.findById(id);

//   if (!isBookingExists) {
//     throw new AppError(404, 'This booking is not found');
//   }

//   // Update assignedTo field (works for add or edit)
//   const result = await Booking.findByIdAndUpdate(id, payload, { new: true });
//   return result;
// };

// const updateBookingStatusIntoDB = async (
//   id: string,
//   payload: { status: string },
// ) => {
//   const isBookingExists = await Booking.findById(id);

//   if (!isBookingExists) {
//     throw new AppError(404, 'This booking is not found');
//   }

//   const result = await Booking.findByIdAndUpdate(id, payload, { new: true });
//   return result;
// };

export const BookingServices = {
  createBookingIntoDB,
  // getBookingsByEmailFromDB,
  // getBookingByIdFromDB,
  // updateBookingRequestIntoDB,
  // getAllBookingByUserFromDB,
  // getBookingAppointmentsFromDB,
  // bookingApprovedRequestIntoDB,
  // bookingAssignedToMemberIntoDB,
  // updateBookingStatusIntoDB,
};
