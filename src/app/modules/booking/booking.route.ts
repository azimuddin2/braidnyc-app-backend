import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BookingValidation } from './booking.validation';
import { BookingControllers } from './booking.controller';
import parseData from '../../middlewares/parseData';
import multer, { memoryStorage } from 'multer';

const router = express.Router();
const upload = multer({ storage: memoryStorage() });

router.post(
  '/',
  auth('customer'),
  upload.fields([{ name: 'images', maxCount: 3 }]),
  parseData(),
  validateRequest(BookingValidation.createBookingValidationSchema),
  BookingControllers.createBooking,
);

// router.get(
//   '/appointments',
//   auth('vendor'),
//   BookingControllers.getBookingAppointments,
// );

// router.get('/', auth('vendor'), BookingControllers.getAllBookingByUser);

router.get('/', auth('customer'), BookingControllers.getBookingsByCustomer);

router.get('/:id', BookingControllers.getBookingById);

// router.patch(
//   '/:id',
//   auth('user'),
//   validateRequest(BookingValidation.updateBookingValidationSchema),
//   BookingControllers.updateBookingRequest,
// );

// router.put(
//   '/update-request/:id',
//   auth('vendor'),
//   BookingControllers.bookingApprovedRequest,
// );

// router.patch(
//   '/assign/:id',
//   auth('vendor'),
//   validateRequest(BookingValidation.assignedMemberValidationSchema),
//   BookingControllers.bookingAssignedToMember,
// );

// router.put(
//   '/update-status/:id',
//   auth('vendor'),
//   validateRequest(BookingValidation.updateBookingStatusValidationSchema),
//   BookingControllers.updateBookingStatus,
// );

export const BookingRoutes = router;
