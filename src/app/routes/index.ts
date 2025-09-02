import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { OtpRoutes } from '../modules/otp/otp.route';
import { ProductRoutes } from '../modules/product/product.route';
import { PackagesRoutes } from '../modules/packages/packages.route';
import { TeamRoutes } from '../modules/team/team.route';
import { VendorRoutes } from '../modules/vendor/vendor.route';
import { TaskRoutes } from '../modules/task/task.route';
import { ReviewRoutes } from '../modules/review/review.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/vendors',
    route: VendorRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/otp',
    route: OtpRoutes,
  },
  {
    path: '/products',
    route: ProductRoutes,
  },
  {
    path: '/services',
    route: PackagesRoutes,
  },
  {
    path: '/team-members',
    route: TeamRoutes,
  },
  {
    path: '/tasks',
    route: TaskRoutes,
  },
  {
    path: '/reviews',
    route: ReviewRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
