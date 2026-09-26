import express from "express";
import {
  createCodOrder,
  createUpiOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getAdminStats,
} from "../controller/orderController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Customer routes
router.post("/orders/cod", protect, createCodOrder);
router.post("/orders/upi", protect, createUpiOrder);
router.get("/orders/mine", protect, getMyOrders);
router.get("/orders/:id", protect, getOrderById);

// Admin routes
router.get("/orders/all", protect, adminOnly, getAllOrders);
router.put("/orders/:id/status", protect, adminOnly, updateOrderStatus);
router.delete("/orders/:id", protect, adminOnly, deleteOrder);
router.get("/admin/stats", protect, adminOnly, getAdminStats);

export default router;
