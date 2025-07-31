import express from 'express';
import multer, { memoryStorage } from 'multer';
import { ProductControllers } from './product.controller';
import parseData from '../../middlewares/parseData';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidations } from './product.validation';

const router = express.Router();
const upload = multer({ storage: memoryStorage() });

router.post(
  '/',
  auth('service_provider'),
  upload.fields([{ name: 'images', maxCount: 10 }]),
  parseData(),
  validateRequest(ProductValidations.createProductValidationSchema),
  ProductControllers.createProduct,
);

router.get('/', ProductControllers.getAllProduct);
router.get('/:id', ProductControllers.getProductById);

router.patch(
  '/:id',
  auth('service_provider'),
  upload.fields([{ name: 'images', maxCount: 10 }]),
  parseData(),
  validateRequest(ProductValidations.updateProductValidationSchema),
  ProductControllers.updateProduct,
);

router.delete(
  '/:id',
  // auth('service_provider', 'admin'),
  ProductControllers.deleteProduct,
);

export const ProductRoutes = router;
