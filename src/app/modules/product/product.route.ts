import express from 'express';
import multer, { memoryStorage } from 'multer';
import { ProductControllers } from './product.controller';
import parseData from '../../middlewares/parseData';
import auth from '../../middlewares/auth';

const router = express.Router();
const upload = multer({ storage: memoryStorage() });

router.post(
  '/',
  // auth('service_provider'),
  upload.fields([{ name: 'images', maxCount: 10 }]),
  parseData(),
  ProductControllers.createProduct,
);

export const ProductRoutes = router;
