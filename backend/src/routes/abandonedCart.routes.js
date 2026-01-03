// routes/abandonedCart.routes.js
import express from "express";
import { getAbandonedCarts, markCartAsConverted } from "../controllers/abandonedCart.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/", getAbandonedCarts);
router.put("/:id/convert", markCartAsConverted);

export default router;
