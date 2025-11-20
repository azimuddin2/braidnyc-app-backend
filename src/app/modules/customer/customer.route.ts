import express from 'express';
import auth from '../../middlewares/auth';
import { CustomerController } from './customer.controller';

const router = express.Router();

router.get('/recommend', CustomerController.getAllRecommendOwner);

export const CustomerRoutes = router;
