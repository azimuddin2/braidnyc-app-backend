import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { PolicyValidation } from './policy.validation';
import { PolicyController } from './policy.controller';

const router = express.Router();

router.post(
  '/',
  auth('admin'),
  validateRequest(PolicyValidation.createPolicyValidationSchema),
  PolicyController.createPolicy,
);

router.get(
  '/:id',
  auth('user', 'vendor', 'admin'),
  PolicyController.getPolicyById,
);

router.patch(
  '/:id',
  auth('admin'),
  validateRequest(PolicyValidation.updatePolicyValidationSchema),
  PolicyController.updatePolicy,
);

router.delete('/:id', auth('admin'), PolicyController.deletePolicy);

export const PolicyRoutes = router;
