import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { PaymentController } from './payment.controller';

const router = Router();

router.post('/checkout', auth(USER_ROLE.user), PaymentController.createPayment);

export const PaymentRoutes = router;
