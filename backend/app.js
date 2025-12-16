//app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Import Routes
import authRoutes from "./src/routes/auth.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import reviewRoutes from "./src/routes/review.routes.js";
import couponRoutes from "./src/routes/coupon.routes.js";
import wishlistRoutes from "./src/routes/wishlist.routes.js";
import cartRoutes from "./src/routes/cart.routes.js";
import adminUserRoutes from "./src/routes/adminUser.routes.js";
// import testRoutes from "./src/routes/test.routes.js";

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminUserRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);

// Test route
// app.use("/api/test", testRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "API is healthy" });
});

export default app;
