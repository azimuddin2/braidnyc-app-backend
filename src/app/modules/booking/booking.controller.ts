import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BookingServices } from './booking.service';

const createBooking = catchAsync(async (req, res) => {
  const result = await BookingServices.createBookingIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Service booking successfully',
    data: result,
  });
});

const getAllBookingByUser = catchAsync(async (req, res) => {
  const result = await BookingServices.getAllBookingByUserFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Bookings retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getBookingAppointments = catchAsync(async (req, res) => {
  const result = await BookingServices.getBookingAppointmentsFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Bookings retrieved successfully',
    data: result,
  });
});

const getBookingsByEmail = catchAsync(async (req, res) => {
  const { email } = req.query;
  const result = await BookingServices.getBookingsByEmailFromDB(
    email as string,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Bookings fetched successfully',
    data: result,
  });
});

const getBookingById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BookingServices.getBookingByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking retrieved successfully',
    data: result,
  });
});

const updateBookingRequest = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BookingServices.updateBookingRequestIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Service booking successfully',
    data: result,
  });
});

const bookingApprovedRequest = catchAsync(async (req, res) => {
  const { id } = req.params;
  const vendorApproved = Boolean(req.body.vendorApproved);

  const updatedBooking = await BookingServices.bookingApprovedRequestIntoDB(
    id,
    vendorApproved,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Request ${vendorApproved ? 'approved' : 'rejected'} successfully.`,
    data: updatedBooking,
  });
});

export const BookingControllers = {
  createBooking,
  getAllBookingByUser,
  getBookingAppointments,
  getBookingsByEmail,
  getBookingById,
  updateBookingRequest,
  bookingApprovedRequest,
};
