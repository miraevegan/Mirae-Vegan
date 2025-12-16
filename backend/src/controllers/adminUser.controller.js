import User from "../models/User.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";

// Get all users with total amount spent + search + sort
export const getAllUsers = async (req, res) => {
  try {
    const { search, sortBy } = req.query;

    // Build search query
    let searchQuery = {};
    if (search) {
      const regex = new RegExp(search, "i");
      searchQuery = {
        $or: [{ name: regex }, { email: regex }, { phone: regex }],
      };
    }

    // Aggregate users with total spent
    const users = await User.aggregate([
      { $match: searchQuery },
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
          totalSpent: { $sum: "$orders.totalPrice" },
          ordersCount: { $size: "$orders" },
        },
      },
      {
        $project: {
          password: 0, // hide password
          orders: 0, // hide orders array to reduce payload
        },
      },
      // Sorting based on query param
      ...(sortBy === "highest-spender"
        ? [{ $sort: { totalSpent: -1 } }]
        : sortBy === "lowest-spender"
        ? [{ $sort: { totalSpent: 1 } }]
        : [{ $sort: { createdAt: -1 } }]), // default recent users
    ]);

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get detailed info + orders of a specific user by id
export const getUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ message: "Invalid user ID" });

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch user's orders, sorted newest first
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .select("orderItems totalPrice isPaid isDelivered createdAt");

    res.json({
      success: true,
      user,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
