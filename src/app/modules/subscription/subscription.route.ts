import { Router } from 'express';
import auth from '../../middlewares/auth';
import { SubscriptionController } from './subscription.controller';
const router = Router();

router.post(
  '/create-subscription',
  auth('vendor'),
  SubscriptionController.createSubscription,
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

export const SubscriptionRoutes = router;
