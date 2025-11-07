import express from 'express';
import multer, { memoryStorage } from 'multer';
import parseData from '../../middlewares/parseData';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { FreelancerServiceValidations } from './freelancerService.validation';
import { FreelancerServiceControllers } from './freelancerService.controller';

const router = express.Router();
const upload = multer({ storage: memoryStorage() });

router.post(
  '/',
  auth('freelancer'),
  upload.fields([
    { name: 'studioFrontPhoto', maxCount: 1 },
    { name: 'studioInsidePhoto', maxCount: 1 },
  ]),
  parseData(),
  validateRequest(
    FreelancerServiceValidations.createFreelancerServiceValidationSchema,
  ),
  FreelancerServiceControllers.createService,
);

// router.get('/availability', PackagesControllers.getAvailability);

router.get(
  '/',
  auth('owner', 'customer', 'freelancer', 'admin'),
  FreelancerServiceControllers.getAllService,
);

router.get(
  '/:id',
  auth('owner', 'customer', 'freelancer', 'admin'),
  FreelancerServiceControllers.getServiceById,
);

router.patch(
  '/:id',
  auth('freelancer'),
  upload.fields([
    { name: 'studioFrontPhoto', maxCount: 1 },
    { name: 'studioInsidePhoto', maxCount: 1 },
  ]),
  parseData(),
  validateRequest(
    FreelancerServiceValidations.updateFreelancerServiceValidationSchema,
  ),
  FreelancerServiceControllers.updateService,
);

router.delete(
  '/:id',
  auth('freelancer'),
  FreelancerServiceControllers.deleteService,
);

export const FreelancerServiceRoutes = router;
