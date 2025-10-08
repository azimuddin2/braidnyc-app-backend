import { Router } from 'express';
import { subscriptionController } from './subscription.controller';
import auth from '../../middlewares/auth';
const router = Router();

router.post(
  '/create-subscription',
  auth('vendor'),
  subscriptionController.createSubscription,
);
// router.get(
//   '/my-ongoing-subscription',
//   auth('vendor'),
//   subscriptionController.myOngoingSubscription,
// );
// router.put(
//   '/update-subscription/:id',
//   auth('vendor'),
//   subscriptionController.updateSubscription,
// );

// router.delete(
//   '/delete-subscription/:id',
//   auth('vendor'),
//   subscriptionController.cancelPayment,
// );

export const subscriptionRoutes = router;
