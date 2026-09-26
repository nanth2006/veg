import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import toast from "react-hot-toast";

const STEPS = ["Shipping Address", "Payment Method"];
const UPI_ID = import.meta.env.VITE_UPI_ID || "nanthakumar2006geetha02@oksbi";
const UPI_NAME = import.meta.env.VITE_UPI_NAME || "FreshVeg Direct Store";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    line1: "",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600001",
  });
  const [method, setMethod] = useState(""); // "cod" | "upi"
  const [upiAppOpened, setUpiAppOpened] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [placing, setPlacing] = useState(false);

  // Delivery fee calculation
  const deliveryFee = total >= 299 ? 0 : 35;
  const grandTotal = total + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="text-4xl mb-3">🛒</div>
        <p className="text-slate-600 text-base font-semibold mb-4">Your cart is empty.</p>
        <Link
          to="/products"
          className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm"
        >
          Browse Fresh Products
        </Link>
      </div>
    );
  }

  function handleAddressChange(e) {
    setAddress({ ...address, [e.target.name]: e.target.value });
  }

  function addressValid() {
    return (
      address.fullName.trim() &&
      address.phone.trim() &&
      address.line1.trim() &&
      address.city.trim() &&
      address.state.trim() &&
      address.pincode.trim()
    );
  }

  function goToPayment(e) {
    e.preventDefault();
    if (!addressValid()) {
      toast.error("Please fill in all shipping address fields");
      return;
    }
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function buildOrderItems() {
    return cart.map((c) => ({
      product: c._id,
      title: c.title,
      link: c.link,
      rate: c.rate,
      qty: c.qty,
    }));
  }

  const orderNote = `FreshVeg-Order-${Date.now()}`;
  const upiLink =
    `upi://pay?pa=${encodeURIComponent(UPI_ID)}` +
    `&pn=${encodeURIComponent(UPI_NAME)}` +
    `&am=${encodeURIComponent(grandTotal)}` +
    `&cu=INR` +
    `&tn=${encodeURIComponent(orderNote)}`;

  // Copy UPI ID to clipboard
  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUpi(true);
    toast.success("UPI ID copied to clipboard!");
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  async function placeCodOrder() {
    setPlacing(true);
    try {
      const res = await api.post("/orders/cod", {
        items: buildOrderItems(),
        totalAmount: grandTotal,
        address,
      });
      clearCart();
      toast.success("Order placed successfully! Confirmation email sent. 🎉");
      navigate("/order-success", { state: { order: res.data } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not place COD order");
    } finally {
      setPlacing(false);
    }
  }

  async function confirmUpiPaid() {
    setPlacing(true);
    try {
      const res = await api.post("/orders/upi", {
        items: buildOrderItems(),
        totalAmount: grandTotal,
        address,
        upiTransactionNote: orderNote,
      });
      clearCart();
      toast.success("UPI Order confirmed! Confirmation email sent. 🎉");
      navigate("/order-success", { state: { order: res.data } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not place UPI order");
    } finally {
      setPlacing(false);
    }
  }

  function handlePlaceOrder() {
    if (!method) {
      toast.error("Please select a payment method");
      return;
    }
    if (method === "cod") {
      placeCodOrder();
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/70 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Stepper Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm transition-all duration-200 ${
                  i <= step
                    ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-xs sm:text-sm font-bold ${
                  i <= step ? "text-slate-900" : "text-slate-400"
                }`}
              >
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={`w-8 sm:w-16 h-0.5 rounded ${
                    step > 0 ? "bg-brand-600" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Step 1 or Step 2 */}
          <div className="lg:col-span-7 space-y-6">
            {step === 0 && (
              <form
                onSubmit={goToPayment}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 space-y-5"
              >
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-extrabold text-slate-900 font-display">
                    📍 Delivery Address
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Where should we deliver your farm fresh produce?
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="e.g. Nanthakumar G"
                      value={address.fullName}
                      onChange={handleAddressChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number (For Delivery Partner) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="e.g. 9876543210"
                      value={address.phone}
                      onChange={handleAddressChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      House / Flat No, Street, Landmark *
                    </label>
                    <input
                      type="text"
                      name="line1"
                      placeholder="e.g. Flat 302, Green Valley Apts, Anna Nagar"
                      value={address.line1}
                      onChange={handleAddressChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={address.city}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-3.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
                      <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={address.state}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-3.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        placeholder="600001"
                        value={address.pincode}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-3.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 text-white font-extrabold text-sm shadow-glow transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>Continue to Payment (₹{grandTotal})</span>
                  <span>→</span>
                </button>
              </form>
            )}

            {step === 1 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 space-y-6">
                <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 font-display">
                      💳 Select Payment Method
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Fast, trusted & zero transaction charges
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="text-xs font-bold text-brand-600 hover:underline"
                  >
                    Edit Address
                  </button>
                </div>

                {/* Payment Options Selection */}
                <div className="space-y-4">
                  {/* Option 1: Cash on Delivery */}
                  <div
                    onClick={() => {
                      setMethod("cod");
                      setUpiAppOpened(false);
                    }}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-start gap-4 ${
                      method === "cod"
                        ? "border-brand-600 bg-brand-50/50 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="text-3xl mt-0.5">💵</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-slate-900 text-base">
                          Cash on Delivery (COD)
                        </h4>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Pay at Doorstep
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Pay cash or scan QR when your vegetables are delivered.
                      </p>
                    </div>
                  </div>

                  {/* Option 2: Instant UPI */}
                  <div
                    onClick={() => setMethod("upi")}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-start gap-4 ${
                      method === "upi"
                        ? "border-brand-600 bg-brand-50/50 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="text-3xl mt-0.5">📱</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-slate-900 text-base">
                          UPI (GPay / PhonePe / Paytm)
                        </h4>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                          Instant & Safe
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Direct 1-tap UPI app payment with prefilled amount ₹{grandTotal}.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detailed UPI Payment Box */}
                {method === "upi" && (
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">⚡</span>
                        <span className="font-bold text-sm">UPI Payment Details</span>
                      </div>
                      <span className="text-emerald-400 font-extrabold text-base">
                        ₹{grandTotal}
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      {/* UPI ID Row with Copy button */}
                      <div className="bg-slate-800/90 p-3 rounded-xl flex items-center justify-between border border-slate-700">
                        <div>
                          <div className="text-[10px] text-slate-400">Store UPI ID:</div>
                          <div className="font-mono font-bold text-sm text-emerald-300 select-all">
                            {UPI_ID}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={copyUpiId}
                          className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold text-xs transition-colors"
                        >
                          {copiedUpi ? "Copied! ✓" : "Copy ID"}
                        </button>
                      </div>

                      {/* Mobile Deep Link Button */}
                      <div>
                        <a
                          href={upiLink}
                          onClick={() => setUpiAppOpened(true)}
                          className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 text-center shadow-lg transition-all"
                        >
                          <span>🚀 Tap to Open GPay / PhonePe (₹{grandTotal})</span>
                        </a>
                        <p className="text-[11px] text-slate-400 text-center mt-2">
                          (Works instantly on your mobile phone with any UPI App)
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Place Order CTA Buttons */}
                <div className="pt-2">
                  {method === "upi" ? (
                    <button
                      type="button"
                      onClick={confirmUpiPaid}
                      disabled={placing}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 text-white font-extrabold text-base shadow-glow transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {placing ? (
                        <span>Processing & Sending Email...</span>
                      ) : (
                        <span>✓ I Have Paid ₹{grandTotal} — Place Order</span>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={placing || !method}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 text-white font-extrabold text-base shadow-glow transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {placing ? (
                        <span>Placing Your Order...</span>
                      ) : (
                        <span>Confirm Cash on Delivery Order (₹{grandTotal})</span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Order Items Breakdown */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs font-semibold text-slate-400">
                  {cart.length} unique items
                </span>
              </h3>

              {/* Items preview list */}
              <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1 divide-y divide-slate-50">
                {cart.map((item) => (
                  <div key={item._id} className="pt-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 max-w-[200px]">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                        {item.link && (
                          <img
                            src={item.link}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-slate-800 truncate">{item.title}</div>
                        <div className="text-slate-400">Qty: {item.qty} × ₹{item.rate}</div>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">₹{item.rate * item.qty}</span>
                  </div>
                ))}
              </div>

              {/* Bill Details */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-slate-800">₹{total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  {deliveryFee === 0 ? (
                    <span className="font-bold text-emerald-600">FREE</span>
                  ) : (
                    <span className="font-semibold text-slate-800">₹{deliveryFee}</span>
                  )}
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="text-sm font-extrabold text-slate-900">Total Payable</span>
                  <span className="text-xl font-extrabold text-brand-700">₹{grandTotal}</span>
                </div>
              </div>

              {/* Delivery Guarantee badge */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-800 text-xs flex items-center gap-2">
                <span className="text-base">⚡</span>
                <span>Farm fresh guarantee &bull; 30-45 min delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
