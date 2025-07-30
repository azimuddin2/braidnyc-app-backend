import express from 'express';
import multer, { memoryStorage } from 'multer';
import parseData from '../../middlewares/parseData';
import auth from '../../middlewares/auth';
import { PackagesControllers } from './packages.controller';

const router = express.Router();
const upload = multer({ storage: memoryStorage() });

router.post(
  '/',
  // auth('service_provider'),
  upload.fields([{ name: 'images', maxCount: 10 }]),
  parseData(),
  PackagesControllers.createPackages,
);

router.get('/', PackagesControllers.getAllPackages);
router.get('/:id', PackagesControllers.getPackagesById);

router.patch(
  '/:id',
  // auth('service_provider'),
  upload.fields([{ name: 'images', maxCount: 10 }]),
  parseData(),
  PackagesControllers.updatePackages,
);

export const PackagesRoutes = router;
