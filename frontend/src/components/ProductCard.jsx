import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [addedAnim, setAddedAnim] = useState(false);

  // Fallback placeholder if image link is missing or fails
  const fallbackImg =
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80";

  // Calculate a realistic MRP (Market Price) for discount presentation
  const originalRate = Math.round(product.rate * 1.25);
  const discountPercent = Math.round(((originalRate - product.rate) / originalRate) * 100);

  function handleAdd() {
    addToCart(product, qty);
    setAddedAnim(true);
    toast.success(`Added ${qty} × ${product.title} to cart! 🛒`, {
      style: {
        borderRadius: "12px",
        background: "#064e3b",
        color: "#ecfdf5",
        fontWeight: "600",
      },
      iconTheme: {
        primary: "#34d399",
        secondary: "#064e3b",
      },
    });
    setTimeout(() => {
      setAddedAnim(false);
      setQty(1);
    }, 1200);
  }

  const isLowStock = product.stock !== undefined && product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-white rounded-2xl shadow-card hover:shadow-soft border border-slate-100 hover:border-brand-200 transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Product Image Container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={product.link || fallbackImg}
          alt={product.title}
          onError={(e) => {
            e.target.src = fallbackImg;
          }}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
            <span>🏷️</span> {discountPercent}% OFF
          </div>
        )}

        {/* Veg icon */}
        <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-white/90 backdrop-blur-sm rounded border border-green-600 flex items-center justify-center p-0.5 shadow-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
        </div>

        {/* Category Pill on Image */}
        {product.category && (
          <div className="absolute bottom-2 left-2.5 bg-slate-900/70 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md">
            {product.category}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Title */}
        <h3 className="font-bold text-slate-800 text-base leading-snug capitalize mb-1 line-clamp-2 group-hover:text-brand-700 transition-colors">
          {product.title}
        </h3>

        {/* Short description */}
        <p className="text-slate-500 text-xs line-clamp-1 mb-3">
          {product.description || "Farm fresh organic produce harvested daily."}
        </p>

        {/* Stock / Freshness Indicator */}
        <div className="flex items-center gap-2 mb-3">
          {isOutOfStock ? (
            <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
              Out of stock
            </span>
          ) : isLowStock ? (
            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
              Only {product.stock} left!
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              In Stock &bull; Farm Fresh
            </span>
          )}
        </div>

        {/* Price Section */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xl font-extrabold text-slate-900">₹{product.rate}</span>
          <span className="text-xs text-slate-400 line-through">₹{originalRate}</span>
          <span className="text-xs font-semibold text-brand-600">
            {product.category === "dairy" ? "/ item" : "/ kg"}
          </span>
        </div>

        {/* Action Bottom Bar */}
        <div className="mt-auto pt-2 flex items-center gap-2">
          {/* Quantity Selector */}
          <div className="flex items-center border border-slate-200 bg-slate-50 rounded-xl overflow-hidden shadow-inner">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={isOutOfStock}
              className="w-8 h-9 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 active:bg-slate-300 font-bold transition-colors disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-bold text-slate-800">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              disabled={isOutOfStock}
              className="w-8 h-9 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 active:bg-slate-300 font-bold transition-colors disabled:opacity-30"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`flex-1 h-9 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5 ${
              addedAnim
                ? "bg-emerald-700 text-white scale-95"
                : "bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 text-white active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            }`}
          >
            {addedAnim ? (
              <>
                <span>✓</span> Added!
              </>
            ) : (
              <>
                <span>🛒</span> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
