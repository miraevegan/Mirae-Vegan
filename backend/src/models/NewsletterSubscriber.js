// src/models/NewsletterSubscriber.js
import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["subscribed", "unsubscribed"],
      default: "subscribed",
    },

    subscribedAt: {
      type: Date,
      default: Date.now,
    },

    unsubscribedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("NewsletterSubscriber", newsletterSchema);
