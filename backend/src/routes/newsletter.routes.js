// src/routes/newsletter.routes.js
import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";
import { getSubscribers, sendNewsletter, subscribe, unsubscribe } from "../controllers/newsletter.controller.js";

const router = express.Router();

// Public routes
router.post("/subscribe", subscribe);
router.get("/unsubscribe", unsubscribe);

// Protected admin route for sending newsletters
router.post("/send", protect, adminOnly, sendNewsletter);
router.get("/subscribers", protect, adminOnly, getSubscribers);

export default router;
