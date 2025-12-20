import Order from "../models/Order.js";
import { sendOrderEmail } from "../services/brevoEmail.service.js";

/**
 * USER: Create Order
 */
export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentStatus: "pending",
      orderStatus: "pending",
      isPaid: false,
      isDelivered: false,
    });

    console.log("user email:", req.user.email);
    console.log("admin email:", process.env.ADMIN_EMAIL);

    // Email admin notifying new order
    try {
      console.log("Sending new order email to admin...");
      await sendOrderEmail(
        process.env.ADMIN_EMAIL,
        "🛒 New Order Placed",
        "new-order.html",
        {
          orderId: order._id.toString(),
          userName: req.user.name,
          totalPrice: order.totalPrice,
        }
      );
      console.log("New order email sent successfully.");
    } catch (emailError) {
      console.error("Error sending new order email:", emailError);
    }

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: error.message });
  }
};

// POST /orders/from-cart
export const createOrderFromCart = async (req, res) => {
  const user = await User.findById(req.user._id).populate("cart.productId");

  if (!user.cart || user.cart.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const orderItems = user.cart.map(item => ({
    product: item.productId._id,
    name: item.productId.name,
    price: item.productId.price,
    quantity: item.quantity,
    image: item.productId.images?.[0]?.url || "",
  }));

  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const taxPrice = 0;
  const shippingPrice = 0;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  const order = await Order.create({
    user: user._id,
    orderItems,
    shippingAddress: req.body.shippingAddress,
    paymentMethod: "RAZORPAY",
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentStatus: "pending",
    orderStatus: "pending",
  });

  res.status(201).json({ success: true, order });
};

/**
 * USER: Get My Orders
 */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * USER / ADMIN: Get Single Order
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product", "name");

    if (!order) return res.status(404).json({ message: "Order not found" });

    // user can only see their order unless admin
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

/**
 * ADMIN: Get All Orders
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * ADMIN: Mark Order as Paid
 */
export const markOrderPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "email name"
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentStatus = "paid";
    order.isPaid = true;
    order.paidAt = new Date();
    order.orderStatus = "confirmed";

    await order.save();

    // Email user confirming order payment
    await sendOrderEmail(
      order.user.email,
      "✅ Payment Received - Order Confirmed",
      "order-confirmed.html",
      {
        name: order.user.name,
        orderId: order._id,
        totalPrice: order.totalPrice,
      }
    )

    res.json({ success: true, order });
  } catch (error) {
    console.error("Mark order paid error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * ADMIN: Update Order Status (e.g. shipped, dispatched, delivered)
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id).populate("user", "email");
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = orderStatus;

    if (orderStatus === "delivered") {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    await order.save();

    await sendOrderEmail(
      order.user.email,
      "✅ Order Update",
      "order-status-update.html",
      {
        LOGO_URL: process.env.LOGO_URL,
        userName: order.user.name,
        orderId: order._id,
        totalPrice: order.totalPrice,
        orderStatus: orderStatus,
        orderStatusMessage: "Your order status has been updated to '" + orderStatus + "'.",
        TRACK_ORDER_URL: "www.google.com",
        YEAR: new Date().getFullYear(),
      }
    )

    res.json({ success: true, order });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: error.message });
  }
};
