import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DashboardService } from './dashboard.service';

const getAdminDashboardStats = catchAsync(async (req, res) => {
  const result = await DashboardService.getAdminDashboardStats();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin Dashboard Stats retrieved successfully',
    data: result,
  });
});

export const DashboardControllers = {
  getAdminDashboardStats,
};
