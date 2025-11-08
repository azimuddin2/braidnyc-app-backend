import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ProductTypeValidation } from './category.validation';
import { ProductTypeControllers } from './category.controller';

const router = express.Router();

router.post(
  '/',
  auth('admin'),
  validateRequest(ProductTypeValidation.createProductTypeValidationSchema),
  ProductTypeControllers.createProductType,
);

router.get('/', ProductTypeControllers.getAllProductType);

router.get('/:id', ProductTypeControllers.getProductTypeById);

router.patch(
  '/:id',
  auth('admin'),
  validateRequest(ProductTypeValidation.updateProductTypeValidationSchema),
  ProductTypeControllers.updateProductType,
);

router.delete('/:id', auth('admin'), ProductTypeControllers.deleteProductType);

export const ProductTypeRoutes = router;
