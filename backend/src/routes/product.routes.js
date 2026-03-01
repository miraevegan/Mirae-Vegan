import express from "express";
import {
  createProduct,
  addProductImages,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  getVariantAvailability,
  bestSellers,
  justLanded,
  addVariantImages,
  deleteVariantImage,
  getCategories,
  veganProducts,
} from "../controllers/product.controller.js";

import { productUpload } from "../utils/multer.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

/**
 * ===============================
 * PUBLIC / USER ROUTES
 * ===============================
 * No auth required
 */

// 🔹 Collections / Home sections
router.get("/best-sellers", bestSellers);
router.get("/just-landed", justLanded);
router.get("/vegan", veganProducts);

// 🔹 Product listing (filters, pagination, sorting)
router.get("/", getAllProducts);

// 🔹 Categories (distinct)
router.get("/categories", getCategories);

// 🔹 Variant availability (size / color stock)
router.get("/:slug/availability", getVariantAvailability);

// 🔹 Single product (by slug)
// ⚠️ MUST BE LAST among GET routes
router.get("/:slug", getSingleProduct);

/**
 * ===============================
 * ADMIN ROUTES
 * ===============================
 * Auth + Admin required
 */

// ✅ CREATE PRODUCT
router.post(
  "/",
  protect,
  adminOnly,
  productUpload,
  createProduct
);

// ✅ UPDATE PRODUCT (details + variants + optional images)
router.put(
  "/:id",
  protect,
  adminOnly,
  productUpload,
  updateProduct
);

// ✅ ADD PRODUCT IMAGES ONLY
router.put(
  "/:id/images",
  protect,
  adminOnly,
  productUpload,
  addProductImages
);

// Add variant images to a specific variant
router.put(
  "/:productId/variants/:variantId/images",
  protect,
  adminOnly,
  productUpload,
  addVariantImages
);

// Delete a variant image by publicId
router.delete(
  "/:productId/variants/:variantId/images/:publicId",
  protect,
  adminOnly,
  deleteVariantImage
);

// ✅ DELETE SINGLE PRODUCT IMAGE
router.delete(
  "/:id/images/:publicId",
  protect,
  adminOnly,
  deleteProductImage
);

// ✅ DELETE PRODUCT (hard delete)
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

export default router;
