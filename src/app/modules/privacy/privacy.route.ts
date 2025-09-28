import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { PrivacyValidation } from './privacy.validation';
import { PrivacyController } from './privacy.controller';

const router = express.Router();

router.post(
  '/',
  auth('admin'),
  validateRequest(PrivacyValidation.createPrivacyValidationSchema),
  PrivacyController.createPrivacy,
);

router.get(
  '/:id',
  auth('user', 'vendor', 'admin'),
  PrivacyController.getPrivacyById,
);

router.patch(
  '/:id',
  auth('admin'),
  validateRequest(PrivacyValidation.updatePrivacyValidationSchema),
  PrivacyController.updatePrivacy,
);

router.delete('/:id', auth('admin'), PrivacyController.deletePrivacy);

export const PrivacyRoutes = router;
