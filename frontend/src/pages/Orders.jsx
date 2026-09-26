import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";

const statusStepMap = {
  placed: 1,
  processing: 2,
  shipped: 3,
  delivered: 4,
  cancelled: 0,
};

const statusBadgeColors = {
  placed: "bg-blue-50 text-blue-700 border-blue-200",
  processing: "bg-amber-50 text-amber-700 border-amber-200",
  shipped: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/orders/mine")
      .then((res) => {
        if (!cancelled) setOrders(res.data);
      })
      .catch((err) => console.log("Orders fetch error:", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <Loader label="Retrieving your order history..." />;

  return (
    <div className="min-h-screen bg-slate-50/70 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            My Orders
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Track and view your past and active vegetable deliveries.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-card border border-slate-100 max-w-lg mx-auto">
            <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-3xl mb-4">
              📦
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">No orders placed yet</h2>
            <p className="text-slate-500 text-xs sm:text-sm mb-6">
              When you place an order, you'll be able to track live delivery status here.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
            >
              <span>Explore Farm Produce</span>
              <span>→</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const currentStep = statusStepMap[order.orderStatus] || 1;
              const isCancelled = order.orderStatus === "cancelled";

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-3xl p-6 sm:p-7 shadow-card border border-slate-100 space-y-5"
                >
                  {/* Top Bar: Order ID, Date & Status Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-slate-900 text-sm sm:text-base">
                          #{order._id}
                        </span>
                        <span
                          className={`text-xs font-bold px-3 py-0.5 rounded-full border capitalize ${
                            statusBadgeColors[order.orderStatus] || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Ordered on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-lg sm:text-xl font-extrabold text-brand-700">
                        ₹{order.totalAmount}
                      </div>
                      <div className="text-xs font-semibold text-slate-500 capitalize">
                        {order.paymentMethod === "cod" ? "💵 Cash on Delivery" : "📱 UPI Paid"} &bull; {order.paymentStatus}
                      </div>
                    </div>
                  </div>

                  {/* Status Progress Stepper */}
                  {!isCancelled && (
                    <div className="py-2">
                      <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        {[
                          { step: 1, label: "Placed", icon: "✓" },
                          { step: 2, label: "Packed", icon: "📦" },
                          { step: 3, label: "On the Way", icon: "🛵" },
                          { step: 4, label: "Delivered", icon: "🎉" },
                        ].map((s) => (
                          <div key={s.step} className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1 transition-all ${
                                currentStep >= s.step
                                  ? "bg-brand-600 text-white shadow-sm"
                                  : "bg-slate-100 text-slate-400"
                              }`}
                            >
                              {s.icon}
                            </div>
                            <span
                              className={`text-[11px] font-semibold ${
                                currentStep >= s.step ? "text-slate-900 font-bold" : "text-slate-400"
                              }`}
                            >
                              {s.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ordered Items List */}
                  <div className="bg-slate-50/80 rounded-2xl p-4 divide-y divide-slate-100 space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-1">
                      Ordered Items ({order.items.length})
                    </div>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="pt-2 flex items-center justify-between text-xs sm:text-sm">
                        <div className="flex items-center gap-3">
                          {item.link && (
                            <img
                              src={item.link}
                              alt={item.title}
                              className="w-10 h-10 rounded-lg object-cover bg-white"
                            />
                          )}
                          <div>
                            <span className="font-bold text-slate-800 capitalize">
                              {item.title}
                            </span>
                            <span className="text-slate-400 ml-1.5 font-medium">
                              × {item.qty}
                            </span>
                          </div>
                        </div>
                        <span className="font-bold text-slate-900">
                          ₹{item.rate * item.qty}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  {order.address && (
                    <div className="text-xs text-slate-500 pt-1 flex items-start gap-2">
                      <span>📍</span>
                      <span>
                        <strong className="text-slate-700">{order.address.fullName}</strong> &bull; {order.address.phone} &bull; {order.address.line1}, {order.address.city}, {order.address.state} - {order.address.pincode}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
