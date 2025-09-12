import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidation } from './order.validation';
import { OrderControllers } from './order.controller';

const router = express.Router();

router.post(
  '/',
  auth('user'),
  validateRequest(OrderValidation.createOrderValidationSchema),
  OrderControllers.createOrder,
);

router.get('/', auth('user'), OrderControllers.getOrdersByEmail);

router.get('/:id', OrderControllers.getOrderById);

export const OrderRoutes = router;
