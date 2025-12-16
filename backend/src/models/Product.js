import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    discount: {
      percentage: {
        type: Number,
        default: 0,
      },
      discountedPrice: {
        type: Number,
      },
    },

    category: {
      type: String,
      required: true,
      index: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

    images: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
      },
    ],

    ratings: {
      type: Number,
      default: 0,
    },

    numOfReviews: {
      type: Number,
      default: 0,
    },

    isBestSeller: {
      type: Boolean,
      default: false,
    },

    isJustLanded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/**
 * Auto-generate slug
 */
productSchema.pre("save", function () {
  if (!this.isModified("name")) return;

  this.slug = this.name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
});


export default mongoose.model("Product", productSchema);
