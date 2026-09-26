import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand & Story */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">🥦</span>
              <div>
                <span className="text-2xl font-extrabold text-white tracking-tight font-display">
                  Fresh<span className="text-brand-400">Veg</span>
                </span>
                <span className="block text-[10px] tracking-widest text-brand-300 font-semibold uppercase -mt-1">
                  Direct from Farmers
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              We connect local organic farmers directly to your kitchen. 100% pesticide-free, handpicked daily, and delivered within 30-45 minutes.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-950/80 text-brand-400 border border-brand-800">
                🌱 100% Organic Certified
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                ⚡ 30m Express Delivery
              </span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4 font-display">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/products?cat=vegetables" className="hover:text-brand-400 transition-colors flex items-center gap-2">
                  <span>🥕</span> Fresh Vegetables
                </Link>
              </li>
              <li>
                <Link to="/products?cat=leafy greens" className="hover:text-brand-400 transition-colors flex items-center gap-2">
                  <span>🥬</span> Leafy Greens & Herbs
                </Link>
              </li>
              <li>
                <Link to="/products?cat=fruits" className="hover:text-brand-400 transition-colors flex items-center gap-2">
                  <span>🍎</span> Organic Seasonal Fruits
                </Link>
              </li>
              <li>
                <Link to="/products?cat=exotic" className="hover:text-brand-400 transition-colors flex items-center gap-2">
                  <span>🥦</span> Exotic Veggies & Mushrooms
                </Link>
              </li>
              <li>
                <Link to="/products?cat=dairy" className="hover:text-brand-400 transition-colors flex items-center gap-2">
                  <span>🥛</span> Farm Milk & Country Eggs
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service & Links */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4 font-display">Customer Support</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/orders" className="hover:text-brand-400 transition-colors">
                  Track Your Orders
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-400 transition-colors">
                  Contact & Store Location
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-brand-400 transition-colors">
                  Shopping Cart & Checkout
                </Link>
              </li>
              <li>
                <span className="text-slate-400">Operating Hours: 6:00 AM – 10:00 PM (Daily)</span>
              </li>
              <li>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 font-medium"
                >
                  <span>💬</span> WhatsApp Live Support
                </a>
              </li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4 font-display">Safe & Instant Payments</h4>
            <p className="text-slate-400 text-sm mb-4">
              Pay securely via UPI (GPay, PhonePe, Paytm, BHIM) or Cash on Delivery at your doorstep.
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="bg-slate-800 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700">📱 GPay</span>
              <span className="bg-slate-800 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700">🟣 PhonePe</span>
              <span className="bg-slate-800 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700">🔷 Paytm UPI</span>
              <span className="bg-slate-800 text-emerald-400 px-3 py-1.5 rounded-lg border border-slate-700">💵 Cash on Delivery</span>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400 flex items-center gap-2">
              <span className="text-base">🛡️</span>
              <span>100% Quality & Freshness Guarantee or Instant Replacement</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FreshVeg Direct. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400">Privacy Policy</span>
            <span className="hover:text-slate-400">Terms of Service</span>
            <span className="hover:text-slate-400">Farm Assurance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
