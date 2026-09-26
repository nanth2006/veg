import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { itemCount, total } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  function handleLogout() {
    logout();
    navigate("/");
  }

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Shop Produce" },
    { to: "/contact", label: "Contact Us" },
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Notification Announcement Bar */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-emerald-900 text-brand-100 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
        <span>🌿 100% Farm Fresh Harvested Daily &bull; ⚡ Free Delivery on orders over ₹299! &bull; Pay with UPI or COD</span>
      </div>

      {/* Main Navbar */}
      <nav
        className={`transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md py-2.5"
            : "bg-white/90 backdrop-blur-sm shadow-sm py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-fresh-500 flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform duration-200">
              🥦
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
                Fresh<span className="text-brand-600">Veg</span>
              </span>
              <span className="block text-[10px] font-bold tracking-wider text-brand-600 uppercase -mt-1">
                Direct Store
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  isActive(link.to)
                    ? "text-brand-700 bg-brand-50 font-bold"
                    : "text-slate-600 hover:text-brand-600 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Action Icons & Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-100/80 hover:bg-brand-50 text-slate-700 hover:text-brand-700 font-semibold text-sm transition-all duration-200 border border-slate-200/80 hover:border-brand-200 group"
            >
              <div className="relative">
                <span className="text-lg">🛒</span>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-gradient-to-r from-brand-500 to-emerald-600 text-white text-[11px] font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center shadow-sm animate-bounce">
                    {itemCount}
                  </span>
                )}
              </div>
              <span>Cart</span>
              {total > 0 && (
                <span className="font-bold text-brand-700 ml-0.5">₹{total}</span>
              )}
            </Link>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link
                  to="/orders"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive("/orders")
                      ? "text-brand-700 bg-brand-50"
                      : "text-slate-600 hover:text-brand-600"
                  }`}
                >
                  📦 My Orders
                </Link>

                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="px-3 py-2 rounded-lg text-sm font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors flex items-center gap-1.5"
                  >
                    <span>⚡</span> Admin
                  </Link>
                )}

                <div className="flex items-center gap-2 pl-1">
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center border border-brand-200 shadow-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 max-w-[90px] truncate">
                    {user?.name?.split(" ")[0]}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                >
                  🚪
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 rounded-xl shadow-sm hover:shadow-glow transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger & Cart */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/cart"
              className="relative p-2 rounded-lg bg-slate-100 text-slate-700 text-lg"
            >
              🛒
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none text-xl"
              aria-label="Toggle menu"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xl px-4 py-4 animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2.5 rounded-lg text-base font-semibold ${
                  isActive(link.to)
                    ? "bg-brand-50 text-brand-700 font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <Link
              to="/cart"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50"
            >
              <span>🛒 Shopping Cart</span>
              <span className="bg-brand-100 text-brand-700 text-xs px-2.5 py-1 rounded-full font-bold">
                {itemCount} items &bull; ₹{total}
              </span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/orders"
                  className="px-3 py-2.5 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50"
                >
                  📦 My Orders
                </Link>

                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="px-3 py-2.5 rounded-lg text-base font-bold bg-amber-50 text-amber-800 border border-amber-200"
                  >
                    ⚡ Admin Management Panel
                  </Link>
                )}

                <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <span className="text-sm font-semibold text-slate-800">
                      {user?.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-3 mt-2 border-t border-slate-100">
                <Link
                  to="/login"
                  className="text-center py-2.5 font-semibold text-slate-700 bg-slate-100 rounded-xl text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-center py-2.5 font-bold text-white bg-brand-600 rounded-xl text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
