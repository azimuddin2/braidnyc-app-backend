import { Payment } from '../payment/payment.model';
import { User } from '../user/user.model';

const getAdminDashboardStats = async () => {
  // 🔹 Total Users
  const totalUsers = await User.countDocuments({ isDeleted: false });

  // 🔹 Total Earnings (vendorAmount)
  const [paymentStats] = await Payment.aggregate([
    {
      $match: {
        status: 'paid',
        isDeleted: false,
      },
    },
    {
      $group: { _id: null, total: { $sum: '$vendorAmount' } },
    },
  ]);

  const totalIncome = paymentStats?.total || 0;

  return {
    totalUsers,
    totalIncome,
  };
};

export const DashboardService = {
  getAdminDashboardStats,
};
