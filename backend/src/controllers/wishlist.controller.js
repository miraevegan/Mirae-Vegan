import User from "../models/User.js";
import Product from "../models/Product.js";
import { isValidObjectId } from "../utils/validateObjectId.js";

const isSameWishlistItem = (item, productId, variantId) => {
  return item.productId.toString() === productId && item.variantId.toString() === variantId;
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId, variantId } = req.body;

    if (!isValidObjectId(productId) || !isValidObjectId(variantId)) {
      return res.status(400).json({ message: "Invalid product or variant id" });
    }

    // Check product exists
    const product = await Product.findById(productId).select("variants");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check variant exists in product variants
    if (!product.variants.some(v => v._id.toString() === variantId)) {
      return res.status(404).json({ message: "Variant not found" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if already in wishlist
    const exists = user.wishlist.some(item =>
      item.productId.toString() === productId && item.variantId.toString() === variantId
    );
    if (exists) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    user.wishlist.push({ productId, variantId });
    await user.save();

    res.json({
      success: true,
      message: "Added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "wishlist.productId",
        select:
          "name slug images variants discount ratings isBestSeller isJustLanded",
      })
      .lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    // For each wishlist item, populate variant details from product.variants
    const wishlistWithVariant = user.wishlist.map(item => {
      const product = item.productId;
      if (!product) return null;

      // Find variant details inside product.variants
      const variant = product.variants.find(v => v._id.toString() === item.variantId.toString());

      return {
        product,
        variant,
      };
    }).filter(Boolean);

    res.json({
      success: true,
      wishlist: wishlistWithVariant,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId, variantId } = req.query;

    if (!isValidObjectId(productId) || !isValidObjectId(variantId)) {
      return res.status(400).json({ message: "Invalid product or variant id" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.wishlist = user.wishlist.filter(
      item => !(item.productId.toString() === productId && item.variantId.toString() === variantId)
    );

    await user.save();

    res.json({
      success: true,
      message: "Removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleWishlist = async (req, res) => {
  try {
    const { productId, variantId } = req.body;

    if (!isValidObjectId(productId) || !isValidObjectId(variantId)) {
      return res.status(400).json({ message: "Invalid product or variant id" });
    }

    const product = await Product.findById(productId).select("variants");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!product.variants.some(v => v._id.toString() === variantId)) {
      return res.status(404).json({ message: "Variant not found" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const existsIndex = user.wishlist.findIndex(item =>
      item.productId.toString() === productId && item.variantId.toString() === variantId
    );

    let action;
    if (existsIndex >= 0) {
      // Remove
      user.wishlist.splice(existsIndex, 1);
      action = "removed";
    } else {
      // Add
      user.wishlist.push({ productId, variantId });
      action = "added";
    }

    await user.save();

    res.json({
      success: true,
      action,
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};