import React, { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "../../api/orderApi.js";

const STATUSES = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

const rupee = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const fmtDate = (d) =>
  new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const statusColor = {
  Pending: "bg-gray-100 text-gray-600",
  Confirmed: "bg-blue-50 text-blue-600",
  Processing: "bg-amber-50 text-amber-600",
  Shipped: "bg-indigo-50 text-indigo-600",
  Delivered: "bg-green-50 text-green-600",
  Cancelled: "bg-red-50 text-red-600",
};
const payColor = {
  Paid: "bg-green-50 text-green-600",
  Pending: "bg-gray-100 text-gray-600",
  Failed: "bg-red-50 text-red-600",
  Refunded: "bg-purple-50 text-purple-600",
};

const Badge = ({ text, map }) => (
  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${map[text] || "bg-gray-100 text-gray-600"}`}>
    {text}
  </span>
);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders({ status: statusFilter || undefined, search: search.trim() || undefined });
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Failed to fetch orders:", error);
      alert(error.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleStatusChange = async (order, orderStatus) => {
    try {
      setSaving(true);
      const updated = await updateOrderStatus(order._id, orderStatus);
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
      setSelected(updated);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? "Loading..." : `${orders.length} orders`}
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchOrders();
          }}
          className="flex flex-wrap gap-2"
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Order no, name, phone, email"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 outline-none focus:border-pink-400"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-pink-400"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button type="submit" className="bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-lg text-sm transition">
            Search
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        {orders.length === 0 ? (
          <div className="text-center py-10 text-gray-500">{loading ? "Loading..." : "No orders found"}</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((o) => (
                <tr key={o._id} onClick={() => setSelected(o)} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-4 py-3 font-medium text-gray-800">{o.orderNumber}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {o.customer?.name}
                    <div className="text-xs text-gray-400">{o.customer?.phone}</div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">{rupee(o.totalAmount)}</td>
                  <td className="px-4 py-3"><Badge text={o.paymentStatus} map={payColor} /></td>
                  <td className="px-4 py-3"><Badge text={o.orderStatus} map={statusColor} /></td>
                  <td className="px-4 py-3 text-gray-500">{fmtDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{selected.orderNumber}</h2>
                <p className="text-xs text-gray-500">{fmtDate(selected.createdAt)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-5 text-sm">
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">Customer</h3>
                <p className="text-gray-600">{selected.customer?.name}</p>
                <p className="text-gray-600">{selected.customer?.phone}</p>
                <p className="text-gray-600 break-all">{selected.customer?.email}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">Delivery address</h3>
                <p className="text-gray-600">
                  {selected.address?.line1}
                  {selected.address?.line2 ? `, ${selected.address.line2}` : ""}
                </p>
                <p className="text-gray-600">
                  {selected.address?.city}, {selected.address?.state} - {selected.address?.pincode}
                </p>
              </div>
            </div>

            <h3 className="font-semibold text-gray-700 mb-2 text-sm">Items</h3>
            <div className="border rounded-lg divide-y mb-4">
              {selected.items?.map((i, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 text-sm">
                  {i.image && <img src={i.image} alt="" className="w-12 h-12 rounded object-cover bg-gray-100" />}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800">{i.name}</p>
                    <p className="text-xs text-gray-500">
                      {i.age ? `${i.age} · ` : ""}Qty {i.quantity} × {rupee(i.price)}
                    </p>
                  </div>
                  <span className="font-medium text-gray-800">{rupee(i.price * i.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="text-sm text-gray-600 space-y-1 mb-5">
              <div className="flex justify-between"><span>Subtotal</span><span>{rupee(selected.subtotal)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{rupee(selected.shippingCharge)}</span></div>
              <div className="flex justify-between font-semibold text-gray-800 text-base pt-1 border-t">
                <span>Total</span><span>{rupee(selected.totalAmount)}</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">Payment</h3>
                <Badge text={selected.paymentStatus} map={payColor} />
                <p className="text-xs text-gray-500 mt-2 break-all">Razorpay order: {selected.razorpayOrderId}</p>
                <p className="text-xs text-gray-500 break-all">Payment ID: {selected.razorpayPaymentId || "-"}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">Order status</h3>
                <select
                  value={selected.orderStatus}
                  disabled={saving}
                  onChange={(e) => handleStatusChange(selected, e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-pink-400"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {selected.note && (
              <div className="rounded-lg bg-amber-50 text-amber-700 text-sm px-3 py-2">{selected.note}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
