import express from "express";
import {
  addToCart,
  updateCartItem,
  removeFromCart,
  getCart,
  clearCart,
} from "../controllers/cart.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect); // 🔐 all cart routes require login

router.get("/", getCart);

router.post("/add", addToCart);

router.put("/update", updateCartItem);

router.delete(
  "/remove/:productId/:variantId",
  removeFromCart
);

router.delete("/clear", clearCart);

export default router;
