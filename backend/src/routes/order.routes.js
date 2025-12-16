import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  markOrderPaid,
  updateOrderStatus,
} from "../controllers/order.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

// User
router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

// Admin
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/pay", protect, adminOnly, markOrderPaid);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;
