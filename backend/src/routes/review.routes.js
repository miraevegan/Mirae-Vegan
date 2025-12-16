import express from "express";
import {
  getAllReviewsAdmin,
  addReview,
  getProductReviews,
  deleteReview,
} from "../controllers/review.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

router.get("/admin/all", protect, adminOnly, getAllReviewsAdmin);
router.post("/:productId", protect, addReview);
router.get("/:productId", getProductReviews);
router.delete("/:id", protect, adminOnly, deleteReview);

export default router;
