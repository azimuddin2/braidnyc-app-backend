import express from 'express';
import { OwnerRegistrationController } from './ownerRegistration.controller';
import validateRequest from '../../middlewares/validateRequest';
import { OwnerRegistrationValidation } from './ownerRegistration.validation';
import auth from '../../middlewares/auth';
import multer, { memoryStorage } from 'multer';
import parseData from '../../middlewares/parseData';

const router = express.Router();
const upload = multer({ storage: memoryStorage() });

router.post(
  '/',
  auth('owner'),
  upload.fields([
    { name: 'idDocument', maxCount: 1 },
    { name: 'businessRegistration', maxCount: 1 },
    { name: 'salonFrontPhoto', maxCount: 1 },
    { name: 'salonInsidePhoto', maxCount: 1 },
    { name: 'salonPhoto', maxCount: 1 },
  ]),
  parseData(),
  validateRequest(OwnerRegistrationValidation.createOwnerRegistrationZodSchema),
  OwnerRegistrationController.createOwnerRegistration,
);

export const OwnerRegistrationRoutes = router;
