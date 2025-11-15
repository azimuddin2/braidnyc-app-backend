import express from 'express';
import multer, { memoryStorage } from 'multer';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OnServiceValidations } from './onService.validation';
import { OnServiceControllers } from './onService.controller';

const router = express.Router();

router.post(
  '/',
  auth('owner', 'freelancer'),
  validateRequest(OnServiceValidations.createOnServiceValidationSchema),
  OnServiceControllers.createOnService,
);

router.get(
  '/',
  auth('owner', 'customer', 'freelancer', 'admin'),
  OnServiceControllers.getAllOnService,
);

router.get('/:id', OnServiceControllers.getOnServiceById);

router.patch(
  '/:id',
  auth('owner', 'freelancer'),
  validateRequest(OnServiceValidations.updateOnServiceValidationSchema),
  OnServiceControllers.updateOnService,
);

router.delete(
  '/:id',
  auth('owner', 'freelancer'),
  OnServiceControllers.deleteOnService,
);

export const OnServiceRoutes = router;
