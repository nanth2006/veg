import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import toast from "react-hot-toast";

export default function Cart() {
  const { cart, increaseQty, decreaseQty, removeFromCart, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");

  const FREE_DELIVERY_THRESHOLD = 299;
  const deliveryFee = total >= FREE_DELIVERY_THRESHOLD || total === 0 ? 0 : 35;
  const amountNeededForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - total);

  const discountAmount = appliedDiscount > 0 ? Math.round(total * (appliedDiscount / 100)) : 0;
  const finalTotal = Math.max(0, total + deliveryFee - discountAmount);

  function applyCoupon(e) {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === "FRESH10") {
      setAppliedDiscount(10);
      setCouponCode("FRESH10 (10% OFF)");
      toast.success("Coupon FRESH10 applied! 10% discount added.");
    } else if (coupon.trim().toUpperCase() === "ORGANIC20" && total >= 400) {
      setAppliedDiscount(20);
      setCouponCode("ORGANIC20 (20% OFF)");
      toast.success("Coupon ORGANIC20 applied! 20% discount added.");
    } else {
      toast.error("Invalid coupon code. Try FRESH10 for 10% off!");
    }
  }

  function removeCoupon() {
    setAppliedDiscount(0);
    setCouponCode("");
    setCoupon("");
    toast.success("Coupon removed");
  }

  const fallbackImg =
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80";

  return (
    <div className="min-h-screen bg-slate-50/70 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Your Shopping Cart
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Review your fresh harvest before proceeding to instant checkout.
            </p>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              Clear Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 sm:p-16 text-center shadow-card border border-slate-100 max-w-lg mx-auto">
            <div className="w-20 h-20 mx-auto rounded-full bg-brand-50 flex items-center justify-center text-4xl mb-4">
              🛒
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
            <p className="text-slate-500 text-sm mb-8">
              Looks like you haven't added any delicious fresh vegetables or fruits yet.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-brand-600 to-emerald-600 text-white font-bold rounded-2xl shadow-glow hover:scale-105 active:scale-95 transition-all text-sm"
            >
              <span>Explore Farm Produce</span>
              <span>→</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Side: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free Delivery Bar */}
              <div className="bg-white p-4 rounded-2xl shadow-card border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-800">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-600">🎉 Congratulations! You unlocked FREE Delivery</span>
                      ) : (
                        <span>
                          Add <span className="font-extrabold text-brand-700">₹{amountNeededForFreeDelivery}</span> more for <span className="font-bold text-emerald-600">FREE Delivery</span>
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Standard delivery fee: ₹35 &bull; Free above ₹299
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full sm:w-36 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-500 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (total / FREE_DELIVERY_THRESHOLD) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Items Card List */}
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl p-4 sm:p-5 shadow-card border border-slate-100 flex items-center gap-4 hover:border-brand-200 transition-colors"
                  >
                    {/* Item Image */}
                    <img
                      src={item.link || fallbackImg}
                      alt={item.title}
                      onError={(e) => {
                        e.target.src = fallbackImg;
                      }}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl bg-slate-100 flex-shrink-0"
                    />

                    {/* Title & Unit Price */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 text-sm sm:text-base capitalize truncate">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        ₹{item.rate} &bull; {item.category || "Produce"}
                      </p>
                      <div className="text-xs font-bold text-brand-700 mt-1 sm:hidden">
                        ₹{item.rate * item.qty}
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center border border-slate-200 bg-slate-50 rounded-xl overflow-hidden shadow-inner">
                      <button
                        type="button"
                        onClick={() => decreaseQty(item._id)}
                        className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 font-bold transition-colors"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-xs sm:text-sm font-bold text-slate-800">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => increaseQty(item._id)}
                        className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="hidden sm:block w-24 text-right">
                      <div className="text-base font-extrabold text-slate-900">
                        ₹{item.rate * item.qty}
                      </div>
                      <div className="text-[10px] text-slate-400">₹{item.rate} × {item.qty}</div>
                    </div>

                    {/* Delete Item */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(item._id)}
                      title="Remove from cart"
                      className="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Continue shopping link */}
              <div className="pt-2">
                <Link
                  to="/products"
                  className="text-xs sm:text-sm font-bold text-brand-700 hover:text-brand-800 inline-flex items-center gap-1.5"
                >
                  <span>← Add more fresh veggies</span>
                </Link>
              </div>
            </div>

            {/* Right Side: Order Summary & Checkout Card */}
            <div className="lg:col-span-4 space-y-4">
              {/* Coupon Code Box */}
              <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  🏷️ Apply Promo Code
                </h3>
                {appliedDiscount > 0 ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                    <div>
                      <div className="font-bold text-emerald-800">{couponCode}</div>
                      <div className="text-emerald-600">Saved ₹{discountAmount} on this order</div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-red-600 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={applyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Try FRESH10"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs uppercase font-bold"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Bill Details */}
              <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
                  Bill Summary
                </h3>

                <div className="space-y-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Items Total ({cart.reduce((s, i) => s + i.qty, 0)} items)</span>
                    <span className="font-semibold text-slate-800">₹{total}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Charges</span>
                    {deliveryFee === 0 ? (
                      <span className="font-bold text-emerald-600">FREE</span>
                    ) : (
                      <span className="font-semibold text-slate-800">₹{deliveryFee}</span>
                    )}
                  </div>

                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Promo Discount</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                    <div>
                      <span className="text-base font-extrabold text-slate-900">Grand Total</span>
                      <p className="text-[10px] text-slate-400">Inclusive of all taxes</p>
                    </div>
                    <span className="text-2xl font-extrabold text-brand-700">₹{finalTotal}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 text-white font-extrabold text-sm shadow-glow hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <span>→</span>
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
                  <span>🔒 Secure SSL Checkout &bull; UPI & COD Accepted</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
