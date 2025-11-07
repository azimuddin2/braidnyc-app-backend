import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import multer, { memoryStorage } from 'multer';
import parseData from '../../middlewares/parseData';
import { FreelancerRegistrationValidation } from './freelancerRegistration.validation';
import { FreelancerRegistrationController } from './freelancerRegistration.controller';

const router = express.Router();
const upload = multer({ storage: memoryStorage() });

router.post(
  '/',
  auth('freelancer'),
  upload.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'idDocument', maxCount: 1 },
    { name: 'businessRegistration', maxCount: 1 },
  ]),
  parseData(),
  validateRequest(
    FreelancerRegistrationValidation.createFreelancerRegistrationZodSchema,
  ),
  FreelancerRegistrationController.createFreelancerRegistration,
);

router.get('/', FreelancerRegistrationController.getAllFreelancers);

router.get(
  '/profile',
  auth('freelancer'),
  FreelancerRegistrationController.getFreelancerProfile,
);

router.get(
  '/:id',
  auth('customer', 'freelancer', 'owner', 'admin'),
  FreelancerRegistrationController.getFreelancerById,
);

router.patch(
  '/:id',
  auth('freelancer'),
  upload.single('image'),
  parseData(),
  validateRequest(
    FreelancerRegistrationValidation.updateFreelancerRegistrationZodSchema,
  ),
  FreelancerRegistrationController.updateFreelancerRegistration,
);

export const FreelancerRegistrationRoutes = router;
