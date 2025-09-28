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
import { BookingRoutes } from '../modules/booking/booking.route';
import { OrderRoutes } from '../modules/order/order.route';
import { PaymentRoutes } from '../modules/payment/payment.route';
import { TermsRoutes } from '../modules/terms/terms.route';
import { PrivacyRoutes } from '../modules/privacy/privacy.route';
import { AboutRoutes } from '../modules/about/about.route';
import { PolicyRoutes } from '../modules/policy/policy.route';

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
  {
    path: '/bookings',
    route: BookingRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
  {
    path: '/payments',
    route: PaymentRoutes,
  },
  {
    path: '/terms',
    route: TermsRoutes,
  },
  {
    path: '/privacy',
    route: PrivacyRoutes,
  },
  {
    path: '/about',
    route: AboutRoutes,
  },
  {
    path: '/policy',
    route: PolicyRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
