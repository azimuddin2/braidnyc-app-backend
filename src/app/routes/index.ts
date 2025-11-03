import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { OtpRoutes } from '../modules/otp/otp.route';
import { TermsRoutes } from '../modules/terms/terms.route';
import { PrivacyRoutes } from '../modules/privacy/privacy.route';
import { AboutRoutes } from '../modules/about/about.route';
import { OwnerRegistrationRoutes } from '../modules/ownerRegistration/ownerRegistration.route';
import { FreelancerRegistrationRoutes } from '../modules/freelancerRegistration/freelancerRegistration.route';
import { OwnerServiceRoutes } from '../modules/ownerService/ownerService.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
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
    path: '/owner-registration',
    route: OwnerRegistrationRoutes,
  },
  {
    path: '/freelancer-registration',
    route: FreelancerRegistrationRoutes,
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
    path: '/owner-services',
    route: OwnerServiceRoutes,
  },

  // TODO: ROUTE UPDATE
  // {
  //   path: '/product-type',
  //   route: ProductTypeRoutes,
  // },
  // {
  //   path: '/products',
  //   route: ProductRoutes,
  // },
  // {
  //   path: '/service-type',
  //   route: ServiceTypeRoutes,
  // },
  // {
  //   path: '/services',
  //   route: PackagesRoutes,
  // },
  // {
  //   path: '/team-members',
  //   route: TeamRoutes,
  // },
  // {
  //   path: '/tasks',
  //   route: TaskRoutes,
  // },
  // {
  //   path: '/reviews',
  //   route: ReviewRoutes,
  // },
  // {
  //   path: '/bookings',
  //   route: BookingRoutes,
  // },
  // {
  //   path: '/orders',
  //   route: OrderRoutes,
  // },
  // {
  //   path: '/payments',
  //   route: PaymentRoutes,
  // },
  // {
  //   path: '/sub-payments',
  //   route: SubPaymentsRoutes,
  // },
  // {
  //   path: '/plans',
  //   route: PlanRoutes,
  // },
  // {
  //   path: '/dashboard',
  //   route: DashboardRoutes,
  // },
  // {
  //   path: '/supports',
  //   route: SupportRoutes,
  // },
  // {
  //   path: '/notifications',
  //   route: NotificationRoutes,
  // },
  // {
  //   path: '/subscriptions',
  //   route: SubscriptionRoutes,
  // },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
