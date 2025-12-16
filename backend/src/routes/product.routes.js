import express from "express";
import {
  createProduct,
  addProductImages,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  bestSellers,
  justLanded,
} from "../controllers/product.controller.js";

import upload from "../utils/multer.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

/**
 * ===============================
 * USER ROUTES
 * ===============================
 */
router.get("/", getAllProducts);
router.get("/best-sellers", bestSellers);
router.get("/just-landed", justLanded);
router.get("/:slug", getSingleProduct);

/**
 * ===============================
 * ADMIN ROUTES
 * ===============================
 */
router.post(
  "/",
  protect,
  adminOnly,
  upload.array("images", 5),
  createProduct
);

router.put(
  "/:id/images",
  protect,
  adminOnly,
  upload.array("images", 5),
  addProductImages
);

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.array("images", 5),
  updateProduct
);

router.delete("/:id", protect, adminOnly, deleteProduct);

router.delete(
  "/:id/images/:publicId",
  protect,
  adminOnly,
  deleteProductImage
);

export default router;
