import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../../api/orderApi.js";

const rupee = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const STATUSES = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

const Card = ({ label, value, sub, to }) => {
  const body = (
    <div className="bg-white rounded-xl shadow-sm p-5 h-full hover:shadow-md transition">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold text-gray-800 mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
  return to ? <Link to={to}>{body}</Link> : body;
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((err) => setError(err.response?.data?.message || "Failed to load dashboard"));
  }, []);

  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!stats) return <div className="p-6 text-gray-500">Loading...</div>;

  const maxRevenue = Math.max(1, ...stats.last7.map((d) => d.revenue));

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your store</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card label="Total revenue" value={rupee(stats.totalRevenue)} sub={`Today ${rupee(stats.todayRevenue)}`} />
        <Card label="Total orders" value={stats.totalOrders} sub={`${stats.todayOrders} today`} to="/admin/orders" />
        <Card label="To ship" value={stats.toShip} sub="Confirmed + Processing" to="/admin/orders" />
        <Card
          label="Products"
          value={stats.activeProducts}
          sub={`${stats.totalProducts} total · ${stats.lowStockCount} low stock`}
          to="/admin/products"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Last 7 days revenue</h2>
          <div className="flex items-end gap-3 h-40">
            {stats.last7.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="text-[10px] text-gray-400 mb-1">{d.revenue ? rupee(d.revenue) : ""}</span>
                <div
                  className="w-full bg-pink-300 rounded-t"
                  style={{ height: `${(d.revenue / maxRevenue) * 100}%`, minHeight: d.revenue ? "4px" : "2px", opacity: d.revenue ? 1 : 0.3 }}
                />
                <span className="text-[10px] text-gray-500 mt-1">{d.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-3">Orders by status</h2>
          <div className="space-y-2 text-sm">
            {STATUSES.map((s) => (
              <div key={s} className="flex justify-between text-gray-600">
                <span>{s}</span>
                <span className="font-medium text-gray-800">{stats.statusCounts[s] || 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">Recent orders</h2>
            <Link to="/admin/orders" className="text-sm text-pink-500">View all</Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p className="text-center py-8 text-gray-500 text-sm">No orders yet</p>
          ) : (
            <div className="divide-y text-sm">
              {stats.recentOrders.map((o) => (
                <div key={o._id} className="flex justify-between px-5 py-3">
                  <div>
                    <p className="font-medium text-gray-800">{o.orderNumber}</p>
                    <p className="text-xs text-gray-500">{o.customer?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">{rupee(o.totalAmount)}</p>
                    <p className="text-xs text-gray-500">{o.orderStatus}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">Low stock (3 or less)</h2>
            <Link to="/admin/products" className="text-sm text-pink-500">Manage</Link>
          </div>
          {stats.lowStock.length === 0 ? (
            <p className="text-center py-8 text-gray-500 text-sm">All stocked up</p>
          ) : (
            <div className="divide-y text-sm">
              {stats.lowStock.map((l, i) => (
                <div key={i} className="flex justify-between px-5 py-3">
                  <span className="text-gray-700">{l.name} <span className="text-gray-400">· {l.age}</span></span>
                  <span className={`font-medium ${l.stock === 0 ? "text-red-500" : "text-amber-600"}`}>
                    {l.stock === 0 ? "Out of stock" : `${l.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
