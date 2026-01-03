import mongoose from "mongoose";

const abandonedCartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  email: String,
  phone: String,
  cartItems: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      variantId: mongoose.Schema.Types.ObjectId,
      quantity: Number,
      priceAtAdd: Number,
    },
  ],
  status: { type: String, enum: ["pending", "converted", "expired"], default: "pending" },
  lastUpdatedAt: { type: Date, default: Date.now },
  abandonedAt: Date,
  convertedAt: Date,
});

export default mongoose.model("AbandonedCart", abandonedCartSchema);
