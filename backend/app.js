import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express();

/* ================= RAZORPAY WEBHOOK (RAW BODY) ================= */

// ⚠️ MUST be before express.json()
app.use(
  "/api/razorpay/webhook",
  bodyParser.raw({ type: "application/json" })
);

/* ================= GLOBAL MIDDLEWARE ================= */

app.use(express.json()); // for all non-webhook routes
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

/* ================= ROUTES ================= */

import razorpayRoutes from "./src/routes/razorpay.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import reviewRoutes from "./src/routes/review.routes.js";
import couponRoutes from "./src/routes/coupon.routes.js";
import wishlistRoutes from "./src/routes/wishlist.routes.js";
import cartRoutes from "./src/routes/cart.routes.js";
import adminUserRoutes from "./src/routes/adminUser.routes.js";
import paymentRoutes from "./src/routes/payment.routes.js";
import invoiceRoutes from "./src/routes/invoice.routes.js";
import newsletterRoutes from "./src/routes/newsletter.routes.js";

app.use("/api/razorpay", razorpayRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminUserRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/newsletter", newsletterRoutes);

/* ================= HEALTH CHECK ================= */

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "API is healthy",
  });
});

export default app;
