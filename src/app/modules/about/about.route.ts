import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { AboutValidation } from './about.validation';
import { AboutController } from './about.controller';

const router = express.Router();

router.post(
  '/',
  auth('admin'),
  validateRequest(AboutValidation.createAboutValidationSchema),
  AboutController.createAbout,
);

router.get(
  '/:id',
  auth('user', 'vendor', 'admin'),
  AboutController.getAboutById,
);

router.patch(
  '/:id',
  auth('admin'),
  validateRequest(AboutValidation.updateAboutValidationSchema),
  AboutController.updateAbout,
);

router.delete('/:id', auth('admin'), AboutController.deleteAbout);

export const AboutRoutes = router;
