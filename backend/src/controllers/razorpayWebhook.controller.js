import crypto from "crypto";
import Order from "../models/Order.js";
import { sendOrderEmail } from "../services/brevoEmail.service.js";
import { generateInvoiceBuffer } from "../services/invoice.service.js";

export const razorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const razorpaySignature = req.headers["x-razorpay-signature"];

    if (!webhookSecret || !razorpaySignature) {
      return res.status(400).json({ success: false });
    }

    // ✅ req.body is RAW BUFFER
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(req.body)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      console.error("❌ Invalid Razorpay webhook signature");
      return res.status(400).json({ success: false });
    }

    const event = JSON.parse(req.body.toString());

    console.log("📩 Webhook hit:", event.event);

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;

      const order = await Order.findOne({
        "paymentResult.razorpayOrderId": payment.order_id,
      }).populate("user");

      if (!order || order.paymentStatus === "paid") {
        return res.status(200).json({ success: true });
      }

      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      order.paidAt = new Date();

      order.paymentResult = {
        ...order.paymentResult,
        razorpayPaymentId: payment.id,
        razorpaySignature,
        status: payment.status,
      };

      await order.save();

      console.log("✅ Payment marked PAID:", order._id);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("🔥 Razorpay webhook error:", error);
    return res.status(500).json({ success: false });
  }
};
