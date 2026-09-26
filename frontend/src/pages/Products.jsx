import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";
import Loader from "../components/Loader.jsx";

const CATEGORY_ITEMS = [
  { id: "all", label: "All Items", icon: "🥦" },
  { id: "vegetables", label: "Vegetables", icon: "🥕" },
  { id: "leafy greens", label: "Leafy Greens", icon: "🥬" },
  { id: "fruits", label: "Organic Fruits", icon: "🍎" },
  { id: "exotic", label: "Exotic & Herbs", icon: "🍄" },
  { id: "dairy", label: "Dairy & Eggs", icon: "🥛" },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("cat") || "all";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("default"); // default | low-high | high-low | name
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Sync category state when URL changes (e.g. clicked footer / home category)
  useEffect(() => {
    const cat = searchParams.get("cat");
    if (cat) setCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get("/products")
      .then((res) => {
        if (!cancelled) setItems(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError("Unable to load fresh products at this moment.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCategorySelect = (catId) => {
    setCategory(catId);
    if (catId === "all") {
      searchParams.delete("cat");
    } else {
      searchParams.set("cat", catId);
    }
    setSearchParams(searchParams);
  };

  const filtered = useMemo(() => {
    let result = items.filter((i) => {
      const matchesSearch =
        i.title.toLowerCase().includes(search.toLowerCase()) ||
        (i.description && i.description.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory =
        category === "all" ||
        (i.category && i.category.toLowerCase() === category.toLowerCase());
      const matchesStock = !onlyInStock || (i.stock !== undefined && i.stock > 0);
      return matchesSearch && matchesCategory && matchesStock;
    });

    if (sortBy === "low-high") {
      result = [...result].sort((a, b) => a.rate - b.rate);
    } else if (sortBy === "high-low") {
      result = [...result].sort((a, b) => b.rate - a.rate);
    } else if (sortBy === "name") {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [items, search, category, sortBy, onlyInStock]);

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setSortBy("default");
    setOnlyInStock(false);
    setSearchParams({});
  };

  if (loading) return <Loader label="Picking fresh produce from the farm..." />;

  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
        <span className="text-4xl mb-3">⚠️</span>
        <p className="text-red-500 font-bold text-lg mb-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-brand-600 text-white font-semibold rounded-xl text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Title & Subtitle */}
        <div className="bg-gradient-to-r from-brand-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-fresh-300">
              Farm Fresh Catalog
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              100% Organic Produce & Essentials
            </h1>
            <p className="text-brand-100 text-sm leading-relaxed">
              Harvested this morning from regional farms. Washed, packed with utmost care, and delivered to your doorstep.
            </p>
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 text-8xl pointer-events-none hidden sm:block">
            🥦
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-card border border-slate-100 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search vegetables, fruits, herbs, milk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm placeholder:text-slate-400 font-medium"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold text-sm"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sorting & Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-200">
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="default">Featured / Newest</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-200 cursor-pointer transition-colors select-none">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 cursor-pointer"
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {CATEGORY_ITEMS.map((cat) => {
              const active = category.toLowerCase() === cat.id.toLowerCase();
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                    active
                      ? "bg-brand-600 text-white shadow-md shadow-brand-500/20 scale-105"
                      : "bg-slate-100/90 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count & Active Filter Indicator */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 font-medium px-1">
          <div>
            Showing <span className="font-bold text-slate-900">{filtered.length}</span> fresh products
            {category !== "all" && (
              <span> in <span className="capitalize font-bold text-brand-700">{category}</span></span>
            )}
            {search && <span> for "<span className="italic font-semibold text-slate-800">{search}</span>"</span>}
          </div>

          {(search || category !== "all" || onlyInStock || sortBy !== "default") && (
            <button
              onClick={resetFilters}
              className="text-brand-600 hover:text-brand-700 font-bold underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-card border border-slate-100 max-w-lg mx-auto">
            <span className="text-5xl mb-4 block">🔍</span>
            <h3 className="text-lg font-bold text-slate-800 mb-1">No products found</h3>
            <p className="text-slate-500 text-xs sm:text-sm mb-6">
              We couldn't find any items matching your filters or search terms.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 bg-brand-600 text-white text-sm font-bold rounded-xl shadow-md hover:bg-brand-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
