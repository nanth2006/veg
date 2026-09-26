import { useState, useEffect } from "react";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import toast from "react-hot-toast";

const emptyForm = {
  title: "",
  link: "",
  rate: "",
  category: "vegetables",
  description: "",
  stock: "100",
};

export default function Admin() {
  const [activeTab, setActiveTab] = useState("orders"); // "orders" | "products" | "stats"
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Product Form state
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Status update tracker
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const fetchAllData = async () => {
    try {
      const [prodRes, orderRes, statRes] = await Promise.allSettled([
        api.get("/products"),
        api.get("/orders/all"),
        api.get("/admin/stats"),
      ]);

      if (prodRes.status === "fulfilled") setProducts(prodRes.value.data);
      if (orderRes.status === "fulfilled") setOrders(orderRes.value.data);
      if (statRes.status === "fulfilled") setStats(statRes.value.data);
    } catch (err) {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  function handleFormChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function startEdit(product) {
    setEditingId(product._id);
    setForm({
      title: product.title,
      link: product.link,
      rate: product.rate,
      category: product.category || "vegetables",
      description: product.description || "",
      stock: product.stock !== undefined ? String(product.stock) : "100",
    });
    setActiveTab("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleProductSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.link || !form.rate) {
      toast.error("Title, image link and price are required");
      return;
    }

    setSubmitting(true);
    const payload = {
      title: form.title,
      link: form.link,
      rate: Number(form.rate),
      category: form.category || "vegetables",
      description: form.description,
      stock: form.stock === "" ? undefined : Number(form.stock),
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success("Product updated successfully! ✅");
      } else {
        await api.post("/products", payload);
        toast.success("New product added to store! ✅");
      }
      cancelEdit();
      await fetchAllData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteProduct(id) {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted successfully");
      await fetchAllData();
    } catch (err) {
      toast.error("Failed to delete product");
    }
  }

  async function handleStatusChange(orderId, newStatus) {
    setUpdatingOrderId(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      toast.success(`Order status updated to "${newStatus}" & email sent to customer! 📧`);
      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingOrderId(null);
    }
  }

  async function handleDeleteOrder(orderId) {
    if (!window.confirm("Delete this order record permanently?")) return;
    try {
      await api.delete(`/orders/${orderId}`);
      toast.success("Order deleted");
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (err) {
      toast.error("Failed to delete order");
    }
  }

  if (loading) return <Loader label="Loading Admin Dashboard..." />;

  return (
    <div className="min-h-screen bg-slate-50/70 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 sm:p-8 rounded-3xl shadow-lg">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <span>⚡</span> Store Administration Control Panel
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
              FreshVeg Admin Portal
            </h1>
          </div>

          {/* Tab Navigation Buttons */}
          <div className="flex items-center gap-2 bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                activeTab === "orders"
                  ? "bg-brand-600 text-white shadow-md"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              📦 Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                activeTab === "products"
                  ? "bg-brand-600 text-white shadow-md"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              🥦 Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                activeTab === "stats"
                  ? "bg-brand-600 text-white shadow-md"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              📊 Stats
            </button>
          </div>
        </div>

        {/* 1. STATS OVERVIEW TAB */}
        {activeTab === "stats" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card">
                <span className="text-2xl">💰</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-2">
                  ₹{stats?.totalRevenue ?? orders.reduce((s, o) => s + (o.totalAmount || 0), 0)}
                </div>
                <div className="text-xs font-semibold text-slate-500">Total Store Revenue</div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card">
                <span className="text-2xl">📦</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-2">
                  {stats?.totalOrders ?? orders.length}
                </div>
                <div className="text-xs font-semibold text-slate-500">Total Customer Orders</div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card">
                <span className="text-2xl">🥦</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-2">
                  {stats?.totalProducts ?? products.length}
                </div>
                <div className="text-xs font-semibold text-slate-500">Active Products Listed</div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card">
                <span className="text-2xl">👥</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-2">
                  {stats?.totalUsers ?? "Active"}
                </div>
                <div className="text-xs font-semibold text-slate-500">Registered Customers</div>
              </div>
            </div>
          </div>
        )}

        {/* 2. ORDERS MANAGEMENT TAB */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-slate-900 font-display">
                All Customer Orders ({orders.length})
              </h2>
              <span className="text-xs text-slate-500">
                Updating status automatically emails the customer ✉️
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl text-center shadow-card border border-slate-100">
                <p className="text-slate-500">No orders received yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-4"
                  >
                    {/* Top Order Row */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-slate-900">
                            #{order._id}
                          </span>
                          <span className="text-xs font-bold text-slate-500">
                            &bull; {order.user?.name || order.address?.fullName} ({order.user?.email || "Email N/A"})
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Placed on {new Date(order.createdAt).toLocaleString("en-IN")} &bull; Phone: {order.address?.phone}
                        </div>
                      </div>

                      {/* Status Dropdown & Payment */}
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-600">Status:</span>
                          <select
                            value={order.orderStatus}
                            disabled={updatingOrderId === order._id}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer capitalize"
                          >
                            <option value="placed">Placed</option>
                            <option value="processing">Processing & Packed</option>
                            <option value="shipped">Out for Delivery (Shipped)</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>

                        <div className="text-sm font-extrabold text-brand-700 bg-brand-50 px-3 py-1 rounded-xl">
                          ₹{order.totalAmount} ({order.paymentMethod?.toUpperCase()})
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteOrder(order._id)}
                          className="text-xs font-bold text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                          title="Delete order"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Customer & Address Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl">
                      <div>
                        <strong className="text-slate-800 block mb-1">📍 Delivery Address:</strong>
                        <p>
                          {order.address?.fullName} ({order.address?.phone})<br />
                          {order.address?.line1}, {order.address?.city}, {order.address?.state} - {order.address?.pincode}
                        </p>
                      </div>

                      <div>
                        <strong className="text-slate-800 block mb-1">Items ({order.items?.length}):</strong>
                        <div className="space-y-1">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>
                                {item.title} × {item.qty}
                              </span>
                              <span className="font-bold text-slate-800">₹{item.rate * item.qty}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. PRODUCTS MANAGEMENT TAB */}
        {activeTab === "products" && (
          <div className="space-y-8 animate-in fade-in">
            {/* Add / Edit Form */}
            <form
              onSubmit={handleProductSubmit}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 font-display">
                    {editingId ? "✏️ Edit Product" : "🌱 Add New Fresh Produce"}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {editingId ? "Update details for this product." : "Fill in the details below to list a new farm product."}
                  </p>
                </div>

                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-bold text-slate-700">
                <div>
                  <label className="block mb-1">Product Title *</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. Fresh Red Tomatoes"
                    value={form.title}
                    onChange={handleFormChange}
                    required
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block mb-1">Image URL (Unsplash or direct link) *</label>
                  <input
                    type="text"
                    name="link"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={form.link}
                    onChange={handleFormChange}
                    required
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block mb-1">Price (₹ per kg / item) *</label>
                  <input
                    type="number"
                    name="rate"
                    placeholder="e.g. 40"
                    value={form.rate}
                    onChange={handleFormChange}
                    required
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block mb-1">Category *</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleFormChange}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-semibold bg-white"
                  >
                    <option value="vegetables">🥕 Vegetables</option>
                    <option value="leafy greens">🥬 Leafy Greens & Herbs</option>
                    <option value="fruits">🍎 Organic Fruits</option>
                    <option value="exotic">🥦 Exotic & Mushrooms</option>
                    <option value="dairy">🥛 Dairy & Eggs</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    placeholder="e.g. 100"
                    value={form.stock}
                    onChange={handleFormChange}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block mb-1">Short Description</label>
                  <input
                    type="text"
                    name="description"
                    placeholder="e.g. Freshly plucked, pesticide-free"
                    value={form.description}
                    onChange={handleFormChange}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Image Live Preview */}
              {form.link && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 max-w-sm">
                  <img
                    src={form.link}
                    alt="Preview"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300";
                    }}
                    className="w-14 h-14 object-cover rounded-xl bg-white"
                  />
                  <div className="text-xs text-slate-500">
                    <strong className="text-slate-800 block">Image Preview</strong>
                    <span>Looks good! Will display on store cards.</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3.5 bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-glow transition-all disabled:opacity-50"
              >
                {submitting ? "Saving..." : editingId ? "Update Product" : "Add Product to Store"}
              </button>
            </form>

            {/* Product Catalog Grid */}
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900 font-display">
                Current Products List ({products.length})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((p) => (
                  <div
                    key={p._id}
                    className="bg-white rounded-2xl p-4 shadow-card border border-slate-100 flex flex-col justify-between"
                  >
                    <div>
                      <img
                        src={p.link}
                        alt={p.title}
                        className="w-full h-36 object-cover rounded-xl mb-3 bg-slate-100"
                      />
                      <h4 className="font-bold text-slate-900 text-sm capitalize line-clamp-1">
                        {p.title}
                      </h4>
                      <div className="flex items-center justify-between mt-1 text-xs">
                        <span className="font-extrabold text-brand-700">₹{p.rate}</span>
                        <span className="text-slate-400 capitalize">{p.category}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">Stock: {p.stock ?? 100}</div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        className="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(p._id)}
                        className="flex-1 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
