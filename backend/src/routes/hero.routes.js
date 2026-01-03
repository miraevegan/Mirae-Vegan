import express from "express";
import { getHero, upsertHero } from "../controllers/hero.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";
import { heroUpload } from "../utils/multer.js";

const router = express.Router();

// Public
router.get("/", getHero);

// Admin
router.post("/", protect, adminOnly, heroUpload, upsertHero);

export default router;
