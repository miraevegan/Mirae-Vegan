import User from "../models/User.js";
import Product from "../models/Product.js";

const transformCart = (cart) =>
  cart.map((item) => ({
    productId: item.productId._id.toString(),
    name: item.productId.name,
    price: item.productId.price,
    image:
      item.productId.images && item.productId.images.length > 0
        ? item.productId.images[0].url
        : "",
    quantity: item.quantity,
  }));

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const user = await User.findById(req.user._id);

    const existingItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      user.cart.push({ productId, quantity: quantity || 1 });
    }

    await user.save();

    // Populate and transform cart before returning
    await user.populate("cart.productId");
    const cart = transformCart(user.cart);

    res.json({
      success: true,
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.productId");

    const cart = transformCart(user.cart);

    res.json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const user = await User.findById(req.user._id);

    const cartItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (!cartItem)
      return res.status(404).json({ message: "Item not found in cart" });

    cartItem.quantity = quantity;
    await user.save();

    await user.populate("cart.productId");
    const cart = transformCart(user.cart);

    res.json({
      success: true,
      message: "Quantity updated",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== productId
    );

    await user.save();

    await user.populate("cart.productId");
    const cart = transformCart(user.cart);

    res.json({
      success: true,
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.cart = [];
    await user.save();

    res.json({
      success: true,
      message: "Cart cleared",
      cart: [],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
