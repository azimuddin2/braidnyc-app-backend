import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { TermsValidation } from './terms.validation';
import { TermsController } from './terms.controller';

const router = express.Router();

router.post(
  '/',
  auth('admin'),
  validateRequest(TermsValidation.createTermsValidationSchema),
  TermsController.createTerms,
);

router.get(
  '/:id',
  auth('user', 'vendor', 'admin'),
  TermsController.getTermsById,
);

router.patch(
  '/:id',
  auth('admin'),
  validateRequest(TermsValidation.updateTermsValidationSchema),
  TermsController.updateTerms,
);

router.delete('/:id', auth('admin'), TermsController.deleteTerms);

export const TermsRoutes = router;
