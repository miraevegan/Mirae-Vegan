import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    landmark: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const cartItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, default: 1 },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    /* ================= BASIC INFO ================= */
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: { type: String, required: true, select: false },
    phone: { type: String },

    /* ================= AUTH ================= */
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationOTP: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },

    resetPasswordOTP: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },

    /* ================= USER DATA ================= */
    addresses: [addressSchema],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    cart: [cartItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
