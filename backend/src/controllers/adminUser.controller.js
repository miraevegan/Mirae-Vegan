import User from "../models/User.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";

/* ===============================
   GET ALL USERS (Admin)
   - Search
   - Sort
   - Orders count
   - Total spent
================================ */
export const getAllUsers = async (req, res) => {
  try {
    const { search = "", sortBy = "recent" } = req.query;

    /* ---------- SEARCH ---------- */
    const matchStage = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    /* ---------- SORT ---------- */
    let sortStage = { createdAt: -1 }; // default: recent

    if (sortBy === "highest-spender") {
      sortStage = { totalSpent: -1 };
    } else if (sortBy === "lowest-spender") {
      sortStage = { totalSpent: 1 };
    }

    /* ---------- AGGREGATION ---------- */
    const users = await User.aggregate([
      { $match: matchStage },

      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "user",
          as: "orders",
        },
      },

      {
        $addFields: {
          ordersCount: { $size: "$orders" },
          totalSpent: {
            $ifNull: [{ $sum: "$orders.totalPrice" }, 0],
          },
        },
      },

      {
        $project: {
          password: 0,
          orders: 0,
          emailVerificationOTP: 0,
          emailVerificationExpires: 0,
          resetPasswordOTP: 0,
          resetPasswordExpires: 0,
        },
      },

      { $sort: sortStage },
    ]);

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

/* ===============================
   GET USER DETAILS (Admin)
   - User info
   - Orders list
================================ */
export const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id).select(
      "-password -emailVerificationOTP -emailVerificationExpires -resetPasswordOTP -resetPasswordExpires"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orders = await Order.find({ user: id })
      .sort({ createdAt: -1 })
      .select(
        "orderItems totalPrice paymentStatus orderStatus isPaid isDelivered createdAt"
      );

    res.json({
      success: true,
      user,
      orders,
    });
  } catch (error) {
    console.error("GET USER DETAILS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch user details" });
  }
};
