import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidations } from './user.validation';
import { UserControllers } from './user.controller';
import { VendorValidations } from '../vendor/vendor.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

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

router.get('/:id', auth('admin'), UserControllers.getSingleUser);

export const UserRoutes = router;
