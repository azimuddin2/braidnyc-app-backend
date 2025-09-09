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

router.get('/', auth('user'), BookingControllers.getBookingsByEmail);

router.get('/:id', BookingControllers.getBookingById);

export const BookingRoutes = router;
