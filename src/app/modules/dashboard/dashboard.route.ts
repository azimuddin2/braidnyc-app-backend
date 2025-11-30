import { Router } from 'express';
import { DashboardControllers } from './dashboard.controller';

const router = Router();

router.get('/request-stats', DashboardControllers.getRequestStats);

export const DashboardRoutes = router;
