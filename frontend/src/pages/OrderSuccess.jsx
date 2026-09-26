import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;
  const [copiedId, setCopiedId] = useState(false);

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <p className="text-slate-500 mb-4">No recent order found.</p>
        <Link
          to="/"
          className="px-6 py-2.5 bg-brand-600 text-white font-bold rounded-xl text-sm"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const copyOrderId = () => {
    navigator.clipboard.writeText(order._id);
    setCopiedId(true);
    toast.success("Order ID copied to clipboard!");
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-100 text-center space-y-6 animate-in zoom-in-95">
        {/* Animated Checkmark Bubble */}
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-brand-500 to-emerald-400 flex items-center justify-center text-4xl text-white shadow-glow">
          ✓
        </div>

        {/* Title & Email Dispatch Alert */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Thank you! Your farm fresh veggies are being packed with love and care.
          </p>
        </div>

        {/* Email Alert Banner */}
        <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2">
          <span>📬</span>
          <span>Confirmation email & receipt sent to your inbox!</span>
        </div>

        {/* Order Details Receipt Card */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 text-left space-y-3.5 text-xs sm:text-sm">
          {/* Order ID */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <span className="text-slate-500 font-medium">Order ID:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-slate-900">#{order._id}</span>
              <button
                type="button"
                onClick={copyOrderId}
                className="text-[10px] font-bold text-brand-700 bg-brand-100 hover:bg-brand-200 px-2 py-0.5 rounded transition-colors"
              >
                {copiedId ? "Copied! ✓" : "Copy"}
              </button>
            </div>
          </div>

          {/* Payment & Amount */}
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Payment Mode:</span>
            <span className="font-bold text-slate-900 uppercase">
              {order.paymentMethod === "cod" ? "💵 Cash on Delivery" : "📱 Online UPI"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Payment Status:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded text-xs capitalize ${
                order.paymentStatus === "paid"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Total Amount Paid:</span>
            <span className="text-base font-extrabold text-brand-700">₹{order.totalAmount}</span>
          </div>

          {/* Shipping Address */}
          {order.address && (
            <div className="border-t border-slate-200 pt-3">
              <span className="text-slate-500 font-medium block mb-1">Delivering To:</span>
              <p className="text-slate-700 leading-relaxed font-semibold">
                {order.address.fullName} ({order.address.phone})<br />
                <span className="font-normal text-slate-500">
                  {order.address.line1}, {order.address.city}, {order.address.state} -{" "}
                  {order.address.pincode}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Link
            to="/orders"
            className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-glow transition-all flex items-center justify-center gap-2"
          >
            <span>📦 View & Track in My Orders</span>
          </Link>

          <Link
            to="/products"
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition-colors flex items-center justify-center gap-2"
          >
            <span>🛒 Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
