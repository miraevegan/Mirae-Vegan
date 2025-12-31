import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  markOrderPaid,
  updateOrderStatus,
  createOrderFromCart,
  cancelOrder,
  hasPurchasedProduct,
} from "../controllers/order.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

/* ================= USER ================= */

// 🔹 IMPORTANT: specific routes first
router.get("/has-purchased/:productId", protect, hasPurchasedProduct);

router.post("/from-cart", protect, createOrderFromCart);
router.get("/my", protect, getMyOrders);
router.put("/:id/cancel", protect, cancelOrder);
router.get("/:id", protect, getOrderById);

/* ================= ADMIN ================= */

router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/pay", protect, adminOnly, markOrderPaid);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;
