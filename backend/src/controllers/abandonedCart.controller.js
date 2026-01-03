// controllers/abandonedCart.controller.js
import AbandonedCart from "../models/AbandonedCart.js";

export const getAbandonedCarts = async (req, res) => {
  try {
    const { status, limit = 20, skip = 0 } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const carts = await AbandonedCart.find(filter)
      .sort({ lastUpdatedAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate({
        path: "cartItems.productId",
        select: "name variants",
      })
      .lean();

    const formattedCarts = carts.map((cart) => {
      // Normalize status: 'pending' => 'abandoned'
      const normalizedStatus = cart.status === "pending" ? "abandoned" : cart.status;

      const items = cart.cartItems.map((item) => {
        const product = item.productId;
        if (!product) {
          // product was deleted? skip
          return null;
        }
        const variant = product.variants.find(
          (v) => v._id.toString() === item.variantId.toString()
        );

        return {
          productId: product._id.toString(),
          variantId: item.variantId.toString(),
          name: product.name,
          variantName: variant?.name || null,
          quantity: item.quantity,
          priceAtAdd: item.priceAtAdd,
        };
      }).filter(Boolean); // remove any nulls

      return {
        ...cart,
        userName: cart.name || "Unknown",
        userEmail: cart.email || "Unknown",
        userPhone: cart.phone || undefined,
        items,
        status: normalizedStatus,
      };
    });

    res.json(formattedCarts);
  } catch (error) {
    console.error("GET ABANDONED CARTS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch abandoned carts" });
  }
};

export const markCartAsConverted = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await AbandonedCart.findByIdAndUpdate(
      id,
      { status: "converted", convertedAt: new Date() },
      { new: true }
    );

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.json(cart);
  } catch (error) {
    console.error("MARK CART CONVERTED ERROR:", error);
    res.status(500).json({ message: "Failed to update cart status" });
  }
};
