import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidations } from './user.validation';
import { UserControllers } from './user.controller';
import { VendorValidations } from '../vendor/vendor.validation';

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

export const UserRoutes = router;
