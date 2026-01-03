import cron from "node-cron";
import AbandonedCart from "../models/AbandonedCart.js";

export async function syncAbandonedCart(user) {
  const populatedUser = await user.populate({
    path: "cart.productId",
    select: "name slug images variants discount price",
  });

  if (populatedUser.cart.length === 0) {
    // If cart is empty, delete abandoned cart record
    await AbandonedCart.deleteOne({ userId: user._id });
    return;
  }

  const cartItems = populatedUser.cart.map((item) => {
    const variant = item.productId.variants.find((v) => v._id.equals(item.variantId));
    const price = variant ? variant.price : 0;
    return {
      productId: item.productId._id,
      variantId: item.variantId,
      quantity: item.quantity,
      priceAtAdd: price,
    };
  });

  await AbandonedCart.findOneAndUpdate(
    { userId: user._id },
    {
      userId: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      cartItems,
      status: "pending",
      lastUpdatedAt: new Date(),
    },
    { upsert: true }
  );
}


const SIX_HOURS = 6 * 60 * 60 * 1000;

export const scheduleAbandonedCartJob = () => {
  // Run every hour
  cron.schedule("0 * * * *", async () => {
    try {
      const cutoffDate = new Date(Date.now() - SIX_HOURS);

      const result = await AbandonedCart.updateMany(
        {
          status: "pending",
          lastUpdatedAt: { $lt: cutoffDate },
          abandonedAt: { $exists: false },
        },
        { $set: { abandonedAt: new Date() } }
      );

      console.log(`[AbandonedCartJob] Marked abandoned: ${result.modifiedCount} carts`);
    } catch (error) {
      console.error("[AbandonedCartJob] Error:", error);
    }
  });
};
