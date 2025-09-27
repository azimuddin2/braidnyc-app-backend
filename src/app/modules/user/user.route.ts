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
  '/buyer/signup',
  validateRequest(UserValidations.registerUserValidationSchema),
  UserControllers.registerUser,
);

router.post(
  '/vendor/signup',
  validateRequest(VendorValidations.vendorRegisterUserValidationSchema),
  UserControllers.vendorRegisterUser,
);

router.get('/', auth('admin'), UserControllers.getAllUsers);

router.get(
  '/profile/:email',
  auth('user', 'admin'),
  UserControllers.getUserProfile,
);

router.patch(
  '/profile/:email',
  auth('user'),
  upload.single('profile'),
  parseData(),
  validateRequest(UserValidations.updateUserValidationSchema),
  UserControllers.updateUserProfile,
);

router.put(
  '/change-status/:id',
  auth('admin'),
  validateRequest(UserValidations.changeStatusValidationSchema),
  UserControllers.changeStatus,
);

export const UserRoutes = router;
