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

export const BookingControllers = {
  createBooking,
};
