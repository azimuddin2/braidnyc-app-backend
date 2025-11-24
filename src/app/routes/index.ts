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
import { SpecialistRoutes } from '../modules/Specialist/Specialist.route';
import { GalleryRoutes } from '../modules/gallery/gallery.route';
import { FreelancerServiceRoutes } from '../modules/freelancerService/freelancerService.route';
import { ReviewRoutes } from '../modules/review/review.route';
import { CategoryRoutes } from '../modules/category/category.route';
import { OnServiceRoutes } from '../modules/onService/onService.route';
import { SubcategoryRoutes } from '../modules/subcategory/subcategory.route';
import { SupportRoutes } from '../modules/support/support.route';
import { MemberRoutes } from '../modules/member/member.route';
import { CustomerRoutes } from '../modules/customer/customer.route';
import { BookingRoutes } from '../modules/booking/booking.route';

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
  {
    path: '/gallery',
    route: GalleryRoutes,
  },
  {
    path: '/specialists',
    route: SpecialistRoutes,
  },
  {
    path: '/freelancer-services',
    route: FreelancerServiceRoutes,
  },
  {
    path: '/reviews',
    route: ReviewRoutes,
  },
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/subcategories',
    route: SubcategoryRoutes,
  },
  {
    path: '/on-services',
    route: OnServiceRoutes,
  },
  {
    path: '/supports',
    route: SupportRoutes,
  },
  {
    path: '/members',
    route: MemberRoutes,
  },
  {
    path: '/customers',
    route: CustomerRoutes,
  },
  {
    path: '/bookings',
    route: BookingRoutes,
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
