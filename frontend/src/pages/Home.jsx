import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/products")
      .then((res) => {
        if (!cancelled && Array.isArray(res.data)) {
          // pick 4-8 featured items
          setFeaturedProducts(res.data.slice(0, 8));
        }
      })
      .catch((err) => console.log("Failed to fetch featured", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = [
    {
      name: "Fresh Vegetables",
      tag: "vegetables",
      icon: "🥕",
      count: "8+ varieties",
      bg: "from-amber-500/10 to-orange-500/10",
      border: "border-amber-200",
    },
    {
      name: "Leafy Greens & Herbs",
      tag: "leafy greens",
      icon: "🥬",
      count: "Farm picked",
      bg: "from-emerald-500/10 to-green-500/10",
      border: "border-emerald-200",
    },
    {
      name: "Organic Fruits",
      tag: "fruits",
      icon: "🍎",
      count: "Juicy & Fresh",
      bg: "from-red-500/10 to-pink-500/10",
      border: "border-rose-200",
    },
    {
      name: "Exotic & Mushrooms",
      tag: "exotic",
      icon: "🥦",
      count: "Premium quality",
      bg: "from-purple-500/10 to-indigo-500/10",
      border: "border-purple-200",
    },
    {
      name: "Dairy & Farm Eggs",
      tag: "dairy",
      icon: "🥛",
      count: "Pure & Organic",
      bg: "from-blue-500/10 to-cyan-500/10",
      border: "border-blue-200",
    },
  ];

  const features = [
    {
      icon: "🌱",
      title: "100% Organic & Chemical-Free",
      desc: "Grown naturally using sustainable organic farming. Free from harsh pesticides.",
    },
    {
      icon: "🚜",
      title: "Direct From Local Farmers",
      desc: "No middlemen. Farmers get fair prices and you get the freshest produce possible.",
    },
    {
      icon: "⚡",
      title: "30-45 Mins Express Delivery",
      desc: "Harvested and packed in sanitized environment, delivered right to your kitchen.",
    },
    {
      icon: "📱",
      title: "UPI & Cash on Delivery",
      desc: "Pay easily with GPay, PhonePe, Paytm QR or pay cash upon doorstep delivery.",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      city: "Chennai",
      rating: "★★★★★",
      comment:
        "The spinach and coriander were so fresh they smelled like they were plucked 10 minutes ago! Delivery was within 35 mins.",
    },
    {
      name: "Karthik Subramanian",
      city: "Coimbatore",
      rating: "★★★★★",
      comment:
        "Paying via GPay UPI was so smooth. The vegetables are unblemished and packed cleanly in eco-friendly paper bags.",
    },
    {
      name: "Ananya Reddy",
      city: "Bangalore",
      rating: "★★★★★",
      comment:
        "Best quality organic veggies at market rates. Tomatoes and baby carrots taste sweet and authentic!",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-hero-pattern text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        {/* Background glow discs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-fresh-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-300 text-xs sm:text-sm font-semibold shadow-sm">
              <span className="animate-bounce">✨</span> Handpicked Daily From Organic Farms
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] font-display">
              Fresh Organic Vegetables, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fresh-300 via-brand-300 to-emerald-200">
                Delivered in 30 Mins.
              </span>
            </h1>

            <p className="text-brand-100/90 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Order fresh leafy greens, farm vegetables, crisp seasonal fruits, and pure dairy at transparent market rates. Fast delivery with UPI or Cash on Delivery.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/products"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-fresh-400 to-brand-400 text-slate-950 font-extrabold text-base shadow-glow hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>🛒 Start Shopping</span>
              </Link>

              <Link
                to="/contact"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-base border border-white/20 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>💬 WhatsApp Order</span>
              </Link>
            </div>

            {/* Mini Trust Stats */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 max-w-lg mx-auto lg:mx-0 text-center sm:text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">20+</div>
                <div className="text-xs text-brand-200 font-medium">Farm Veggies</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">100%</div>
                <div className="text-xs text-brand-200 font-medium">Natural Organic</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">30 Min</div>
                <div className="text-xs text-brand-200 font-medium">Doorstep Delivery</div>
              </div>
            </div>
          </div>

          {/* Right Visual Image Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl p-3 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&auto=format&fit=crop&q=80"
                alt="Farm Fresh Organic Vegetables basket"
                className="w-full h-80 sm:h-96 object-cover rounded-2xl shadow-inner"
              />

              {/* Floating Badge 1 */}
              <div className="absolute -bottom-4 -left-4 bg-white text-slate-900 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100 animate-float">
                <span className="text-2xl">🌿</span>
                <div>
                  <div className="text-xs font-bold text-slate-900">Zero Chemicals</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">100% Certified Safe</div>
                </div>
              </div>

              {/* Floating Badge 2 */}
              <div className="absolute -top-4 -right-4 bg-white text-slate-900 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100">
                <span className="text-2xl">⚡</span>
                <div>
                  <div className="text-xs font-bold text-slate-900">Express Delivery</div>
                  <div className="text-[10px] text-brand-600 font-semibold">Under 45 Mins</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES OVERVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Fresh Harvest</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Explore Our Farm Categories
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1 group"
          >
            <span>View All Produce</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((c) => (
            <Link
              key={c.tag}
              to={`/products?cat=${encodeURIComponent(c.tag)}`}
              className={`p-5 rounded-2xl border ${c.border} bg-gradient-to-b ${c.bg} hover:shadow-soft hover:scale-[1.03] transition-all duration-300 flex flex-col items-center text-center group`}
            >
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl mb-3 group-hover:rotate-6 transition-transform">
                {c.icon}
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-brand-700 transition-colors">
                {c.name}
              </h3>
              <span className="text-xs font-medium text-slate-500 mt-1">{c.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (TODAY'S HARVEST) */}
      <section className="bg-white py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Daily Deals</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                Today's Farm Best Sellers
              </h2>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-50 text-brand-700 font-bold text-sm hover:bg-brand-100 transition-colors"
            >
              <span>Explore All Products</span>
              <span>→</span>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-slate-100 rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p>No products loaded yet. Check back shortly!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. WHY CHOOSE FRESHVEG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">The Farm Direct Advantage</span>
          <h2 className="text-3xl font-extrabold text-slate-900 font-display mt-1">
            Why Choose FreshVeg Direct?
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            We bypass middlemen to deliver farm freshness straight from growers to your dining table.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-card hover:shadow-soft hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-2xl flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PROMO CALL-TO-ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-brand-800 to-green-900 text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 bottom-0 opacity-10 text-9xl pointer-events-none translate-x-12 translate-y-12">
            🥦
          </div>
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="bg-fresh-400 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Special Welcome Offer
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Get 10% Instant OFF on Your First Organic Order
            </h2>
            <p className="text-brand-100 text-sm sm:text-base leading-relaxed">
              Use promo code <span className="font-bold underline text-fresh-300">FRESH10</span> at checkout. Free express delivery on orders over ₹299!
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-slate-900 font-extrabold text-sm hover:bg-brand-50 shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <span>Shop Fresh Now</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CUSTOMER REVIEWS */}
      <section className="bg-slate-100/70 py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Loved by 10,000+ Homes</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card flex flex-col justify-between"
              >
                <div>
                  <div className="text-amber-400 text-base mb-3">{t.rating}</div>
                  <p className="text-slate-600 text-sm leading-relaxed italic">"{t.comment}"</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 font-bold text-sm flex items-center justify-center">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
