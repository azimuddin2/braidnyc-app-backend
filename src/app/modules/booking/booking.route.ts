import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BookingValidation } from './booking.validation';
import { BookingControllers } from './booking.controller';

const router = express.Router();

router.post(
  '/',
  auth('user'),
  validateRequest(BookingValidation.createBookingValidationSchema),
  BookingControllers.createBooking,
);

router.get('/', auth('vendor'), BookingControllers.getAllBookingByUser);

router.get('/user', auth('user'), BookingControllers.getBookingsByEmail);

router.get('/:id', BookingControllers.getBookingById);

router.patch(
  '/:id',
  auth('user'),
  validateRequest(BookingValidation.updateBookingValidationSchema),
  BookingControllers.updateBookingRequest,
);

export const BookingRoutes = router;
