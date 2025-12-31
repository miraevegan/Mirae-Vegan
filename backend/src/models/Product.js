import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    attributes: {
      type: Object, // e.g. { color: "Black", size: "M" }
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    images: {
      type: [
        {
          url: String,
          public_id: String,
        },
      ],
      default: [],
    },

    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
  },
  { _id: true }
);

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
      index: true,
    },

    description: {
      type: String,
      required: true,
    },

    /* 🔹 NEW: Product-level attributes */
    attributes: {
      type: Object,
      default: {}, 
      // e.g. { material: "Cotton", fit: "Regular", sleeve: "Full" }
    },

    /* 🔹 NEW: Structured specifications (better for UI display) */
    specifications: {
      material: { type: String },
      care: { type: String },
      origin: { type: String },
      weight: { type: String },
      warranty: { type: String },
    },

    variants: {
      type: [variantSchema],
      required: true,
      validate: [(v) => v.length > 0, "At least one variant is required"],
    },

    discount: {
      percentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    },

    category: {
      type: String,
      required: true,
      index: true,
    },

    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
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

/* Auto-generate slug */
productSchema.pre("save", function () {
  if (!this.isModified("name")) return;

  this.slug = this.name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
});

export default mongoose.model("Product", productSchema);
