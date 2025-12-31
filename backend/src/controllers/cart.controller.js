import User from "../models/User.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * ===============================
 * ADD TO CART
 * ===============================
 */
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, variantId, quantity = 1 } = req.body;

    if (!isValidObjectId(productId) || !isValidObjectId(variantId)) {
      return res.status(400).json({ message: "Invalid product or variant ID" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const variant = product.variants.id(variantId);
    if (!variant) return res.status(404).json({ message: "Variant not found" });

    if (variant.stock < quantity) {
      return res.status(400).json({
        message: "Insufficient stock",
        availableStock: variant.stock,
      });
    }

    const user = await User.findById(userId);

    const existingItem = user.cart.find(
      (item) =>
        item.productId.toString() === productId &&
        item.variantId.toString() === variantId
    );

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;

      if (newQty > variant.stock) {
        return res.status(400).json({
          message: "Stock limit exceeded",
          availableStock: variant.stock,
        });
      }

      existingItem.quantity = newQty;
    } else {
      user.cart.push({ productId, variantId, quantity });
    }

    await user.save();
    res.json(user.cart);
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    res.status(500).json({ message: "Failed to add to cart" });
  }
};

/**
 * ===============================
 * UPDATE CART ITEM QUANTITY
 * ===============================
 */
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, variantId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const variant = product.variants.id(variantId);
    if (!variant) return res.status(404).json({ message: "Variant not found" });

    if (quantity > variant.stock) {
      return res.status(400).json({
        message: "Insufficient stock",
        availableStock: variant.stock,
      });
    }

    const user = await User.findById(userId);

    const cartItem = user.cart.find(
      (item) =>
        item.productId.toString() === productId &&
        item.variantId.toString() === variantId
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    cartItem.quantity = quantity;
    await user.save();

    res.json(user.cart);
  } catch (error) {
    console.error("UPDATE CART ERROR:", error);
    res.status(500).json({ message: "Failed to update cart" });
  }
};

/**
 * ===============================
 * REMOVE FROM CART
 * ===============================
 */
export const removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter(
      (item) =>
        !(
          item.productId.toString() === req.params.productId &&
          item.variantId.toString() === req.params.variantId
        )
    );

    await user.save();
    res.json(user.cart);
  } catch (error) {
    console.error("REMOVE FROM CART ERROR:", error);
    res.status(500).json({ message: "Failed to remove item" });
  }
};

/**
 * ===============================
 * GET USER CART (POPULATED)
 * ===============================
 */
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "cart.productId",
        select: "name slug images variants discount",
      })
      .lean();

    const cart = user.cart.map((item) => {
      const variant = item.productId.variants.find(
        (v) => v._id.toString() === item.variantId.toString()
      );

      const basePrice = variant?.price ?? 0;
      const discount = item.productId.discount.percentage ?? 0;

      const finalPrice =
        discount > 0
          ? Math.round(basePrice - (basePrice * discount) / 100)
          : basePrice;

      return {
        productId: item.productId._id,
        variantId: item.variantId,
        name: item.productId.name,
        slug: item.productId.slug,
        image: variant?.images?.[0]?.url || item.productId.images[0]?.url,
        price: finalPrice,              // ✅ FINAL price
        originalPrice: basePrice,       // optional (for UI strikethrough)
        discount,
        quantity: item.quantity,
        stock: variant?.stock,
      };
    });

    res.json(cart);
  } catch (error) {
    console.error("GET CART ERROR:", error);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

/**
 * ===============================
 * CLEAR CART
 * ===============================
 */
export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart" });
  }
};
