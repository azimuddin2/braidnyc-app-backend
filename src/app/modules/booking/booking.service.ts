import AppError from '../../errors/AppError';
import { Booking } from './booking.model';
import { SERVICE_MODEL_TYPE, TBooking } from './booking.interface';
import { User } from '../user/user.model';
import { OwnerService } from '../ownerService/ownerService.model';
import { FreelancerService } from '../freelancerService/freelancerService.model';
import { uploadManyToS3 } from '../../utils/awsS3FileUploader';
import { Specialist } from '../Specialist/Specialist.model';

const createBookingIntoDB = async (payload: TBooking, files: any) => {
  const { customer, service, vendor, date, time, specialist, serviceType } =
    payload;

  // -------------------------------
  // 1️⃣ Validate Time Format
  // -------------------------------
  const timeRegex = /^\d{1,2}:\d{2} (AM|PM) - \d{1,2}:\d{2} (AM|PM)$/;
  if (!timeRegex.test(time)) {
    throw new AppError(
      400,
      'Invalid time format. Use: "hh:mm AM - hh:mm PM" (Example: 05:30 PM - 06:30 PM)',
    );
  }

  // -------------------------------
  // 2️⃣ Convert time to minutes
  // -------------------------------
  const parseToMinutes = (t: string) => {
    const [timeStr, mod] = t.trim().split(' ');
    let [h, m] = timeStr.split(':').map(Number);

    if (h < 1 || h > 12 || m < 0 || m > 59) {
      throw new AppError(400, 'Invalid time range values');
    }

    if (mod === 'PM' && h !== 12) h += 12;
    if (mod === 'AM' && h === 12) h = 0;

    return h * 60 + m;
  };

  const [slotStartStr, slotEndStr] = time.split(' - ');
  const slotStart = parseToMinutes(slotStartStr);
  const slotEnd = parseToMinutes(slotEndStr);

  // -------------------------------
  // 3️⃣ Validate Start < End
  // -------------------------------
  if (slotEnd <= slotStart) {
    throw new AppError(400, 'End time must be later than start time');
  }

  // -------------------------------
  // 4️⃣ Auto duration (hours)
  // -------------------------------
  payload.duration = ((slotEnd - slotStart) / 60).toString();

  // -------------------------------
  // 5️⃣ Validate Date
  // -------------------------------
  const today = new Date();
  const bookingDate = new Date(date);

  if (bookingDate < new Date(today.toDateString())) {
    throw new AppError(400, 'Cannot create booking for a past date');
  }

  // Attach slots into payload
  payload.slotStart = slotStart;
  payload.slotEnd = slotEnd;

  // -------------------------------
  // 6️⃣ Validate Customer + Vendor
  // -------------------------------
  const customerExists = await User.findById(customer);
  if (!customerExists) throw new AppError(404, 'Customer does not exist');

  const vendorExists = await User.findById(vendor);
  if (!vendorExists) throw new AppError(404, 'Vendor does not exist');

  const vendorRole = vendorExists.role; // owner | freelancer

  // -------------------------------
  // 7️⃣ Validate Service Type
  // -------------------------------
  const serviceModelMap: any = {
    [SERVICE_MODEL_TYPE.OwnerService]: OwnerService,
    [SERVICE_MODEL_TYPE.FreelancerService]: FreelancerService,
  };

  const ServiceModel = serviceModelMap[serviceType];
  if (!ServiceModel) throw new AppError(400, 'Invalid service type');

  const serviceExists = await ServiceModel.findById(service);
  if (!serviceExists) throw new AppError(404, 'Service does not exist');

  // -------------------------------
  // 8️⃣ Specialist Logic
  // -------------------------------
  if (vendorRole === 'owner') {
    if (!specialist) {
      throw new AppError(400, 'Specialist ID is required for owner vendor');
    }

    const dbSpecialist = await Specialist.findById(specialist);
    if (!dbSpecialist) {
      throw new AppError(404, 'Specialist does not exist');
    }

    // Specialist conflict check using specialist _id
    const specialistConflict = await Booking.findOne({
      specialist,
      date,
      isDeleted: false,
      slotStart: { $lt: slotEnd },
      slotEnd: { $gt: slotStart },
    });

    if (specialistConflict) {
      throw new AppError(409, 'Specialist is not available at this time');
    }
  }

  if (vendorRole === 'freelancer') {
    if (specialist) {
      throw new AppError(400, 'Freelancers cannot assign specialists');
    }
  }

  // -------------------------------
  // 9️⃣ Vendor Conflict Check
  // -------------------------------
  const vendorConflict = await Booking.findOne({
    vendor,
    date,
    isDeleted: false,
    slotStart: { $lt: slotEnd },
    slotEnd: { $gt: slotStart },
  });

  if (vendorConflict) {
    throw new AppError(409, 'Vendor already has a booking at this time');
  }

  // -------------------------------
  // 🔟 File Upload
  // -------------------------------
  if (files?.images?.length) {
    const imgsArray = files.images.map((img: any) => ({
      file: img,
      path: 'images/service',
    }));
    payload.images = await uploadManyToS3(imgsArray);
  } else {
    throw new AppError(400, 'At least one image is required');
  }

  // -------------------------------
  // 1️⃣1️⃣ Save Booking
  // -------------------------------
  return await Booking.create(payload);
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
