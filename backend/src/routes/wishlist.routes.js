import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";

const router = express.Router();

router.post("/", protect, addToWishlist);
router.get("/", protect, getWishlist);
router.delete("/:productId", protect, removeFromWishlist);

export default router;
