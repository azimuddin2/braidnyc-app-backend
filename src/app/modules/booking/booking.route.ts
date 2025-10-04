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

router.get(
  '/appointments',
  auth('vendor'),
  BookingControllers.getBookingAppointments,
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

router.put(
  '/update-request/:id',
  auth('vendor'),
  BookingControllers.bookingApprovedRequest,
);

router.patch(
  '/assign/:id',
  auth('vendor'),
  validateRequest(BookingValidation.assignedMemberValidationSchema),
  BookingControllers.bookingAssignedToMember,
);

export const BookingRoutes = router;
