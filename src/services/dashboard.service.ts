import Order from "@/models/Order";
import dbConnect from "@/lib/db";

export class DashboardService {
    async getMetrics() {
        await dbConnect();

        // 1. Total Sales & Total Orders
        const totals = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalAmount" },
                    totalOrders: { $sum: 1 }
                }
            }
        ]);

        const totalSales = totals.length > 0 ? totals[0].totalSales : 0;
        const totalOrders = totals.length > 0 ? totals[0].totalOrders : 0;

        // 2. Pending and Cancelled Counts
        const statusCounts = await Order.aggregate([
            {
                $match: { status: { $in: ['pending', 'cancelled'] } }
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        let pendingCount = 0;
        let cancelledCount = 0;

        statusCounts.forEach(item => {
            if (item._id === 'pending') pendingCount = item.count;
            if (item._id === 'cancelled') cancelledCount = item.count;
        });

        // 3. Recent Transactions (Last 5 orders)
        const recentTransactions = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('_id createdAt totalAmount status customerDetails.name')
            .lean();

        // Map them to format standard for UI
        const formattedTransactions = recentTransactions.map(trx => {
            const date = new Date(trx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
            return {
                id: `#${String(trx._id).slice(-6).toUpperCase()}`,
                rawId: trx._id,
                date: date,
                status: trx.status.charAt(0).toUpperCase() + trx.status.slice(1),
                amount: trx.totalAmount,
                customer: trx.customerDetails.name
            };
        });

        // Calculate Weekly Chart Data? (We will mock this or build a 7 day lookup if needed)
        // For now, let's keep the return clean.

        return {
            totalSales,
            totalOrders,
            pendingCount,
            cancelledCount,
            recentTransactions: formattedTransactions
        };
    }
}

export const dashboardService = new DashboardService();
