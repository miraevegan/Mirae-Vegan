import mongoose from "mongoose";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import { sendOrderEmail } from "../services/brevoEmail.service.js";

/* ---------------- HELPERS ---------------- */

const getVariantLabel = (variant) => {
  if (!variant?.attributes || typeof variant.attributes !== "object") {
    return "";
  }

  return Object.entries(variant.attributes)
    .map(([key, value]) => {
      if (value && typeof value === "object") {
        return `${key}: ${value.label ?? value.name ?? value.value ?? ""}`;
      }
      return `${key}: ${value}`;
    })
    .join(" / ");
};


/* ======================================================
   USER / ADMIN: MANUAL ORDER (DO NOT USE FOR CHECKOUT)
====================================================== */
export const createOrder = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const {
      orderItems,
      shippingAddress,
      paymentMethod = "UPI_MANUAL",
    } = req.body;

    if (!orderItems?.length) {
      return res.status(400).json({ message: "No order items" });
    }

    const itemsPrice = orderItems.reduce(
      (sum, item) => sum + item.variant.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: itemsPrice,
      paymentStatus: "pending",
      orderStatus: "pending",
    });

    sendOrderEmail(
      process.env.ADMIN_EMAIL,
      "🛒 New Manual Order",
      "new-order.html",
      {
        orderId: order._id,
        userName: req.user.name,
        totalPrice: order.totalPrice,
      }
    ).catch(console.error);

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   USER: CREATE ORDER FROM CART (REAL CHECKOUT)
====================================================== */
export const createOrderFromCart = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(req.user._id).session(session);
    if (!user.cart.length) throw new Error("Cart is empty");

    const orderItems = [];
    let itemsPrice = 0;
    let discountPrice = 0;
    let appliedCoupon = null;

    // 1️⃣ Build order items & calculate itemsPrice
    for (const item of user.cart) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) throw new Error("Product not found");

      const variant = product.variants.id(item.variantId);
      if (!variant) throw new Error("Variant not found");

      if (variant.stock < item.quantity)
        throw new Error(`${getVariantLabel(variant)} out of stock`);

      variant.stock -= item.quantity;
      await product.save({ session });

      const basePrice = variant.price;
      const discount = product.discount?.percentage ?? 0;

      const finalPrice =
        discount > 0
          ? Math.round(basePrice - (basePrice * discount) / 100)
          : basePrice;

      itemsPrice += finalPrice * item.quantity;

      orderItems.push({
        product: product._id,
        variant: {
          id: variant._id,
          label: getVariantLabel(variant),
          price: finalPrice,
        },
        quantity: item.quantity,
        image:
          variant.images?.[0]?.url ||
          product.images?.[0]?.url ||
          "",
      });
    }

    // 2️⃣ Apply coupon AFTER itemsPrice is known
    if (req.body.couponCode) {
      const coupon = await Coupon.findOne({
        code: req.body.couponCode.toUpperCase(),
        isActive: true,
      }).session(session);

      if (!coupon) throw new Error("Invalid coupon");
      if (coupon.expiryDate < new Date()) throw new Error("Coupon expired");
      if (itemsPrice < coupon.minCartValue)
        throw new Error(`Minimum cart value ₹${coupon.minCartValue}`);

      if (coupon.discountType === "percentage") {
        discountPrice = (itemsPrice * coupon.discountValue) / 100;
        if (coupon.maxDiscount)
          discountPrice = Math.min(discountPrice, coupon.maxDiscount);
      } else {
        discountPrice = coupon.discountValue;
      }

      appliedCoupon = coupon;
      coupon.usedCount += 1;
      await coupon.save({ session });
    }

    const totalPrice = Math.max(itemsPrice - discountPrice, 0);

    // 3️⃣ Create order
    const [order] = await Order.create(
      [
        {
          user: user._id,
          orderItems,
          shippingAddress: req.body.shippingAddress,

          itemsPrice,
          discountPrice,
          totalPrice,

          coupon: appliedCoupon
            ? {
                code: appliedCoupon.code,
                discountType: appliedCoupon.discountType,
                discountValue: appliedCoupon.discountValue,
                discountAmount: discountPrice,
              }
            : null,

          paymentMethod: "RAZORPAY",
          paymentStatus: "created", // ✅ FIXED
          orderStatus: "pending",
        },
      ],
      { session }
    );

    user.cart = [];
    await user.save({ session });

    await session.commitTransaction();

    res.status(201).json({ success: true, order });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};


/* ======================================================
   USER: GET MY ORDERS
====================================================== */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("orderItems.product", "name") // <--- populate product with name
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   USER / ADMIN: GET SINGLE ORDER
====================================================== */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product", "name");

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (
      req.user.role !== "admin" &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error("Get order by id error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   ADMIN: GET ALL ORDERS
====================================================== */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   ADMIN: MARK ORDER AS PAID (MANUAL ONLY)
====================================================== */
export const markOrderPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "email name"
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.paymentStatus === "paid") {
      return res.status(400).json({ message: "Order already paid" });
    }

    if (order.paymentMethod === "RAZORPAY") {
      return res.status(400).json({
        message: "Razorpay orders are auto-paid via webhook",
      });
    }

    order.paymentStatus = "paid";
    order.paidAt = new Date();
    order.orderStatus = "confirmed";

    await order.save();

    await sendOrderEmail(
      order.user.email,
      "✅ Payment Received - Order Confirmed",
      "order-confirmed.html",
      {
        customerName: order.user.name,
        orderId: order._id,
        totalPrice: order.totalPrice,
      }
    );

    res.json({ success: true, order });
  } catch (error) {
    console.error("Mark order paid error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   ADMIN: UPDATE ORDER STATUS
====================================================== */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id)
      .populate("user", "email name");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const flow = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["processing", "cancelled"],
      processing: ["shipped"],
      shipped: ["out_for_delivery"],
      out_for_delivery: ["delivered"],
    };

    if (
      order.orderStatus !== "pending" &&
      !flow[order.orderStatus]?.includes(orderStatus)
    ) {
      return res.status(400).json({
        message: `Invalid transition from ${order.orderStatus} → ${orderStatus}`,
      });
    }

    order.orderStatus = orderStatus;

    if (orderStatus === "delivered") {
      order.deliveredAt = new Date();
    }

    await order.save();

    await sendOrderEmail(
      order.user.email,
      "📦 Order Status Updated",
      "order-status-update.html",
      {
        userName: order.user.name,
        orderId: order._id,
        totalPrice: order.totalPrice,
        orderStatus,
      }
    );

    res.json({ success: true, order });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Cancel Order
export const cancelOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(req.params.id).session(session);
    if (!order) throw new Error("Order not found");

    if (
      req.user.role !== "admin" &&
      order.user.toString() !== req.user._id.toString()
    ) {
      throw new Error("Not authorized");
    }

    if (order.orderStatus === "delivered") {
      throw new Error("Delivered orders cannot be cancelled");
    }

    if (order.orderStatus === "cancelled") {
      throw new Error("Order already cancelled");
    }

    for (const item of order.orderItems) {
      const product = await Product.findById(item.product).session(session);
      if (!product) continue;

      const variant = product.variants.id(item.variant.id);
      if (variant) {
        variant.stock += item.quantity;
        await product.save({ session });
      }
    }

    order.orderStatus = "cancelled";
    await order.save({ session });

    await session.commitTransaction();

    res.json({ success: true, message: "Order cancelled & stock restored" });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

export const hasPurchasedProduct = async (req, res) => {
  const { productId } = req.params;

  const order = await Order.findOne({
    user: req.user._id,
    "orderItems.product": productId,
    orderStatus: "delivered",
    paymentStatus: "paid",
  });

  res.json({ hasPurchased: Boolean(order) });
};