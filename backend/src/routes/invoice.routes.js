// routes/invoice.routes.js
import express from "express";
import Order from "../models/Order.js";
import { protect } from "../middleware/auth.middleware.js";
import { generateInvoiceBuffer } from "../services/invoice.service.js";

const router = express.Router();

router.get("/:orderId", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("orderItems.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔐 Authorization
    if (
      order.user.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 💰 Paid check
    if (order.paymentStatus !== "paid") {
      return res
        .status(400)
        .json({ message: "Invoice available only for paid orders" });
    }

    // 📄 Generate PDF
    const invoiceBuffer = await generateInvoiceBuffer(order);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=invoice-${order._id}.pdf`
    );

    res.send(invoiceBuffer);
  } catch (error) {
    console.error("Invoice error:", error);
    res.status(500).json({ message: "Failed to generate invoice" });
  }
});

export default router;
