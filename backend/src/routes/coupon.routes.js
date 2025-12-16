import express from "express";
import {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
} from "../controllers/coupon.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

/**
 * ======================
 * ADMIN ROUTES
 * ======================
 */
router.post("/", protect, adminOnly, createCoupon);
router.put("/:id", protect, adminOnly, updateCoupon);
router.delete("/:id", protect, adminOnly, deleteCoupon);

/**
 * ======================
 * USER ROUTES
 * ======================
*/
router.get("/", protect, getAllCoupons);
router.post("/apply", protect, applyCoupon);
router.get("/:id", protect, getCouponById);

export default router;
