import Order from "../models/Order.js";
import Product from "../models/Product.js";

const LOW_STOCK = 3;

// GET /api/admin/stats   (behind requireAdmin)
export const getDashboardStats = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(startOfToday);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    // revenue counts only paid, non-cancelled orders
    const revenueMatch = { paymentStatus: "Paid", orderStatus: { $ne: "Cancelled" } };

    const [totalOrders, todayOrders, byStatus, revenueAgg, todayRevenueAgg, daily, recentOrders, products] =
      await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ createdAt: { $gte: startOfToday } }),
        Order.aggregate([{ $group: { _id: "$orderStatus", count: { $sum: 1 } } }]),
        Order.aggregate([{ $match: revenueMatch }, { $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
        Order.aggregate([
          { $match: { ...revenueMatch, createdAt: { $gte: startOfToday } } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]),
        Order.aggregate([
          { $match: { ...revenueMatch, createdAt: { $gte: sevenDaysAgo } } },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              revenue: { $sum: "$totalAmount" },
              orders: { $sum: 1 },
            },
          },
        ]),
        Order.find().sort({ createdAt: -1 }).limit(5).select("orderNumber customer.name totalAmount paymentStatus orderStatus createdAt"),
        Product.find().select("name isActive variants"),
      ]);

    const statusCounts = Object.fromEntries(byStatus.map((s) => [s._id, s.count]));

    const lowStock = [];
    for (const p of products) {
      if (p.isActive === false) continue;
      for (const v of p.variants || []) {
        if (v.stock <= LOW_STOCK) lowStock.push({ productId: p._id, name: p.name, age: v.age, stock: v.stock });
      }
    }
    lowStock.sort((a, b) => a.stock - b.stock);

    // fill the last 7 days so the chart has no gaps (server-local dates)
    const dailyMap = new Map(daily.map((d) => [d._id, d]));
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(startOfToday);
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      last7.push({ date: key, revenue: dailyMap.get(key)?.revenue || 0, orders: dailyMap.get(key)?.orders || 0 });
    }

    res.status(200).json({
      totalOrders,
      todayOrders,
      totalRevenue: revenueAgg[0]?.total || 0,
      todayRevenue: todayRevenueAgg[0]?.total || 0,
      toShip: (statusCounts.Confirmed || 0) + (statusCounts.Processing || 0),
      statusCounts,
      totalProducts: products.length,
      activeProducts: products.filter((p) => p.isActive !== false).length,
      lowStock: lowStock.slice(0, 10),
      lowStockCount: lowStock.length,
      last7,
      recentOrders,
    });
  } catch (error) {
    console.error("dashboard stats failed:", error);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};
