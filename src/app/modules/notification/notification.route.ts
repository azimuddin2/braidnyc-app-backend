import { Router } from 'express';
import { notificationControllers } from './notification.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

// router.post("/",)

router.get(
  '/',
  auth(
    USER_ROLE.customer,
    USER_ROLE.freelancer,
    USER_ROLE.owner,
    USER_ROLE.admin,
  ),
  notificationControllers.getAllNotifications,
);

router.patch(
  '/',
  auth(
    USER_ROLE.customer,
    USER_ROLE.freelancer,
    USER_ROLE.owner,
    USER_ROLE.admin,
  ),
  notificationControllers.markAsDone,
);

router.delete(
  '/',
  auth(
    USER_ROLE.customer,
    USER_ROLE.freelancer,
    USER_ROLE.owner,
    USER_ROLE.admin,
  ),
  notificationControllers.deleteNotification,
);

export const NotificationRoutes = router;
