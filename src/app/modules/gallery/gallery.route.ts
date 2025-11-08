import express from 'express';
import multer, { memoryStorage } from 'multer';
import auth from '../../middlewares/auth';
import { GalleryControllers } from './gallery.controller';
import parseData from '../../middlewares/parseData';

const router = express.Router();
const upload = multer({ storage: memoryStorage() });

router.post(
  '/',
  auth('owner', 'freelancer'),
  upload.fields([{ name: 'images', maxCount: 12 }]),
  GalleryControllers.createGallery,
);

router.get(
  '/',
  auth('owner', 'customer', 'freelancer', 'admin'),
  GalleryControllers.getGallery,
);

router.patch(
  '/',
  auth('owner', 'freelancer'),
  upload.fields([{ name: 'images', maxCount: 12 }]),
  parseData(),
  GalleryControllers.updateGallery,
);

export const GalleryRoutes = router;
