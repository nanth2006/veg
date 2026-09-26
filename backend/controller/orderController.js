import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/product.js";
import { sendOrderNotification, sendOrderStatusEmail } from "../utils/sendEmail.js";

// Create a Cash-on-Delivery order
export const createCodOrder = async (req, res) => {
  try {
    const { items, totalAmount, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    if (!address) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount,
      address,
      paymentMethod: "cod",
      paymentStatus: "pending",
      orderStatus: "placed",
    });

    const user = await User.findById(req.user.id);
    await sendOrderNotification(order, user);

    res.status(201).json(order);
  } catch (err) {
    console.error("COD Order Error:", err);
    res.status(500).json({ message: "Failed to place order" });
  }
};

// Create a UPI order
export const createUpiOrder = async (req, res) => {
  try {
    const { items, totalAmount, address, upiTransactionNote } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    if (!address) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount,
      address,
      paymentMethod: "upi",
      paymentStatus: "paid",
      orderStatus: "placed",
      upiTransactionNote: upiTransactionNote || "",
    });

    const user = await User.findById(req.user.id);
    await sendOrderNotification(order, user);

    res.status(201).json(order);
  } catch (err) {
    console.error("UPI Order Error:", err);
    res.status(500).json({ message: "Failed to place order" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email phone");
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (String(order.user?._id || order.user) !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// admin: all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate("user", "name email phone");
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// admin: update order status & notify customer via email
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const updateData = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // If orderStatus was changed, send email update to customer
    if (orderStatus && order.user) {
      await sendOrderStatusEmail(order, order.user, orderStatus);
    }

    res.status(200).json(order);
  } catch (err) {
    console.error("Update order error:", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

// admin: delete order
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete order" });
  }
};

// admin: get statistics overview
export const getAdminStats = async (req, res) => {
  try {
    const [totalOrders, totalProducts, totalUsers, allOrders] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: "user" }),
      Order.find({}),
    ]);

    const totalRevenue = allOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const placedOrders = allOrders.filter((o) => o.orderStatus === "placed").length;
    const deliveredOrders = allOrders.filter((o) => o.orderStatus === "delivered").length;

    res.status(200).json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue,
      placedOrders,
      deliveredOrders,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ message: "Failed to calculate stats" });
  }
};
