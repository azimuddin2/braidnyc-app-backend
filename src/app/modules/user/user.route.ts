import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidations } from './user.validation';
import { UserControllers } from './user.controller';
import { VendorValidations } from '../vendor/vendor.validation';
import auth from '../../middlewares/auth';
import multer, { memoryStorage } from 'multer';
import parseData from '../../middlewares/parseData';

const router = express.Router();
const upload = multer({ storage: memoryStorage() });

router.post(
  '/customer/signup',
  validateRequest(UserValidations.createUserValidationSchema),
  UserControllers.signupCustomer,
);

router.post(
  '/owner/signup',
  validateRequest(UserValidations.createUserValidationSchema),
  UserControllers.signupOwner,
);

router.post(
  '/freelance/signup',
  validateRequest(UserValidations.createUserValidationSchema),
  UserControllers.signupFreelance,
);

// router.get('/', auth('admin', 'user', 'vendor'), UserControllers.getAllUsers);

// router.get(
//   '/profile/:email',
//   auth('user', 'admin'),
//   UserControllers.getUserProfile,
// );

// router.patch(
//   '/profile/:email',
//   auth('user', 'admin'),
//   upload.single('profile'),
//   parseData(),
//   validateRequest(UserValidations.updateUserValidationSchema),
//   UserControllers.updateUserProfile,
// );

// router.put(
//   '/change-status/:id',
//   auth('admin'),
//   validateRequest(UserValidations.changeStatusValidationSchema),
//   UserControllers.changeStatus,
// );

export const UserRoutes = router;
