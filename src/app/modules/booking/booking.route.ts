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

router.get(
  '/request',
  auth('owner', 'freelancer'),
  BookingControllers.getBookings,
);

router.get('/all', auth('admin'), BookingControllers.getAllBookings);

router.get('/', auth('customer'), BookingControllers.getBookingsByCustomer);

router.get('/:id', BookingControllers.getBookingById);

router.put(
  '/completed-status/:id',
  auth('customer'),
  validateRequest(BookingValidation.updateBookingStatusValidationSchema),
  BookingControllers.bookingCompletedStatus,
);

router.put(
  '/canceled-status/:id',
  auth('customer'),
  validateRequest(BookingValidation.updateBookingStatusValidationSchema),
  BookingControllers.bookingCompletedStatus,
);

router.put(
  '/approved-request/:id',
  auth('freelancer', 'owner'),
  validateRequest(BookingValidation.updateBookingRequestValidationSchema),
  BookingControllers.bookingApprovedRequest,
);

router.put(
  '/decline-request/:id',
  auth('freelancer', 'owner'),
  validateRequest(BookingValidation.updateBookingRequestValidationSchema),
  BookingControllers.bookingDeclineRequest,
);

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
