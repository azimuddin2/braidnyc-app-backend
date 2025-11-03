import express from 'express';
import multer, { memoryStorage } from 'multer';
import parseData from '../../middlewares/parseData';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OwnerServiceValidations } from './ownerService.validation';
import { OwnerServiceControllers } from './ownerService.controller';

const router = express.Router();
const upload = multer({ storage: memoryStorage() });

router.post(
  '/',
  auth('owner'),
  upload.fields([{ name: 'images', maxCount: 10 }]),
  parseData(),
  validateRequest(OwnerServiceValidations.createOwnerServiceValidationSchema),
  OwnerServiceControllers.createService,
);

// router.get('/availability', PackagesControllers.getAvailability);

router.get(
  '/',
  auth('owner', 'customer', 'freelancer', 'admin'),
  OwnerServiceControllers.getAllService,
);

router.get('/:id', OwnerServiceControllers.getServiceById);

router.patch(
  '/:id',
  auth('owner'),
  upload.fields([{ name: 'images', maxCount: 10 }]),
  parseData(),
  validateRequest(OwnerServiceValidations.updateOwnerServiceValidationSchema),
  OwnerServiceControllers.updateService,
);

router.delete('/:id', auth('owner'), OwnerServiceControllers.deleteService);

export const OwnerServiceRoutes = router;
