import { Router } from 'express';
import { DashboardControllers } from './dashboard.controller';

const router = Router();

router.get('/admin-stats', DashboardControllers.getAdminDashboardStats);

export const DashboardRoutes = router;
