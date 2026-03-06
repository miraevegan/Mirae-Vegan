import express from "express";
import {
  getAllReviewsAdmin,
  addReview,
  getProductReviews,
  deleteReview,
  getTestimonials,
  updateReviewTestimonial,
  submitFeedback,
} from "../controllers/review.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";
import { reviewUpload } from "../utils/multer.js";

const router = express.Router();

router.get("/admin/all", protect, adminOnly, getAllReviewsAdmin);
router.get("/testimonials", getTestimonials);
router.post("/feedback", reviewUpload, submitFeedback);
router.post("/:productId", protect, reviewUpload, addReview);
router.get("/:productId", getProductReviews);
router.delete("/:id", protect, adminOnly, deleteReview);
router.patch("/:id/testimonial", protect, adminOnly, updateReviewTestimonial);

export default router;
