import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BookingServices } from './booking.service';

const createBooking = catchAsync(async (req, res) => {
  const result = await BookingServices.createBookingIntoDB(req.body, req.files);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Service booking successfully',
    data: result,
  });
});

const getBookings = catchAsync(async (req, res) => {
  const result = await BookingServices.getBookingsFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Bookings retrieved successfully',
    data: result,
  });
});

const getBookingsByCustomer = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const status = req.query.status as string;

  if (!status) {
    throw new AppError(400, 'Status is required');
  }

  const result = await BookingServices.getBookingsByCustomerFromDB(
    userId,
    status,
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

const bookingCompletedStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BookingServices.bookingCompletedStatusIntoDB(
    id,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'The booking has been marked as completed successfully.',
    data: result,
  });
});

const bookingCanceledStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BookingServices.bookingCanceledStatusIntoDB(
    id,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'The booking has been marked as completed successfully.',
    data: result,
  });
});

const bookingApprovedRequest = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BookingServices.bookingApprovedRequestIntoDB(
    id,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking has been approved successfully.',
    data: result,
  });
});

const bookingDeclineRequest = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BookingServices.bookingDeclineRequestIntoDB(
    id,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking has been decline successfully.',
    data: result,
  });
});

// const getBookingAppointments = catchAsync(async (req, res) => {
//   const result = await BookingServices.getBookingAppointmentsFromDB(req.query);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Bookings retrieved successfully',
//     data: result,
//   });
// });

// const getBookingsByEmail = catchAsync(async (req, res) => {
//   const { email } = req.query;
//   const result = await BookingServices.getBookingsByEmailFromDB(
//     email as string,
//   );

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Bookings fetched successfully',
//     data: result,
//   });
// });

// const updateBookingRequest = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await BookingServices.updateBookingRequestIntoDB(id, req.body);

//   sendResponse(res, {
//     statusCode: 201,
//     success: true,
//     message: 'Service booking successfully',
//     data: result,
//   });
// });

// const bookingApprovedRequest = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const vendorApproved = Boolean(req.body.vendorApproved);

//   const updatedBooking = await BookingServices.bookingApprovedRequestIntoDB(
//     id,
//     vendorApproved,
//   );

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: `Request ${vendorApproved ? 'approved' : 'rejected'} successfully.`,
//     data: updatedBooking,
//   });
// });

// const bookingAssignedToMember = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await BookingServices.bookingAssignedToMemberIntoDB(
//     id,
//     req.body,
//   );

//   sendResponse(res, {
//     statusCode: 201,
//     success: true,
//     message: 'Member assigned successfully',
//     data: result,
//   });
// });

// const updateBookingStatus = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await BookingServices.updateBookingStatusIntoDB(id, req.body);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Status updated successfully.',
//     data: result,
//   });
// });

export const BookingControllers = {
  createBooking,
  getBookings,
  getBookingsByCustomer,
  getBookingById,
  bookingCompletedStatus,
  bookingCanceledStatus,
  bookingApprovedRequest,
  bookingDeclineRequest,
  // getAllBookingByUser,
  // getBookingAppointments,
  // getBookingsByEmail,
  // updateBookingRequest,
  // bookingApprovedRequest,
  // bookingAssignedToMember,
  // updateBookingStatus,
};
