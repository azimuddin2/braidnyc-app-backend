import express from 'express';
import multer, { memoryStorage } from 'multer';
import auth from '../../middlewares/auth';
import { GalleryControllers } from './gallery.controller';

const router = express.Router();
const upload = multer({ storage: memoryStorage() });

router.post(
  '/',
  auth('owner', 'freelancer'),
  upload.fields([{ name: 'images', maxCount: 10 }]),
  GalleryControllers.createGallery,
);

// router.get(
//   '/',
//   auth('owner', 'customer', 'freelancer', 'admin'),
//   OwnerServiceControllers.getAllService,
// );

// router.get('/:id', OwnerServiceControllers.getServiceById);

// router.patch(
//   '/:id',
//   auth('owner'),
//   upload.fields([{ name: 'images', maxCount: 10 }]),
//   parseData(),
//   validateRequest(OwnerServiceValidations.updateOwnerServiceValidationSchema),
//   OwnerServiceControllers.updateService,
// );

// router.delete('/:id', auth('owner'), OwnerServiceControllers.deleteService);

export const GalleryRoutes = router;
