import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  toggleWishlist,
} from "../controllers/wishlist.controller.js";

const router = express.Router();

router.post("/", protect, addToWishlist);
router.get("/", protect, getWishlist);
router.delete("/", protect, removeFromWishlist);  // now expecting query params productId & variantId

router.post("/toggle", protect, toggleWishlist);

export default router;
