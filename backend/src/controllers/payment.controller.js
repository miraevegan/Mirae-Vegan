import crypto from "crypto";
import Order from "../models/Order.js";
import { razorpayInstance } from "../config/razorpay.js";
import { sendOrderEmail } from "../services/brevoEmail.service.js";

/* ======================================================
   CREATE RAZORPAY ORDER
====================================================== */
export const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ message: "Order ID is required" });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (order.paymentMethod !== "RAZORPAY") {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    if (order.paymentStatus === "paid") {
      return res.status(400).json({ message: "Order already paid" });
    }

    // ✅ REUSE EXISTING RAZORPAY ORDER
    if (
      order.paymentResult?.razorpayOrderId &&
      ["created", "pending", "processing"].includes(order.paymentStatus)
    ) {
      return res.json({
        key: process.env.RAZORPAY_KEY_ID,
        razorpayOrderId: order.paymentResult.razorpayOrderId,
        amount: order.paymentResult.amount,
        currency: "INR",
      });
    }

    // 🔥 CREATE RAZORPAY ORDER
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: Math.round(order.totalPrice * 100),
      currency: "INR",
      receipt: `order_${order._id}`,
      notes: {
        orderId: order._id.toString(),
        userId: req.user._id.toString(),
      },
    });

    order.paymentStatus = "pending";
    order.paymentResult = {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
    };

    await order.save();

    res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error("Create Razorpay order error:", error);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
};


/* ======================================================
   VERIFY PAYMENT (CLIENT SIDE CONFIRMATION)
====================================================== */
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 🔒 Extra safety
    if (order.paymentResult?.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({ message: "Razorpay order mismatch" });
    }

    if (order.paymentStatus === "paid") {
      return res.json({ success: true });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    order.paymentResult = {
      ...order.paymentResult,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    };

    await order.save();

    res.json({
      success: true,
      message: "Payment verified. Awaiting webhook confirmation.",
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
};
