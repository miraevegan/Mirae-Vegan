import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    /* Website users */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    userName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
    },

    image: {
      url: String,
      public_id: String,
    },

    source: {
      type: String,
      enum: ["website", "manual"],
      default: "website",
    },

    testimonial: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);