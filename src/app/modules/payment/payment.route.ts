import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { PaymentController } from './payment.controller';

const router = Router();

router.get('/', PaymentController.getAllPayment);

router.post('/checkout', auth(USER_ROLE.user), PaymentController.createPayment);

router.get('/confirm-payment', PaymentController.confirmPayment);

export const PaymentRoutes = router;
