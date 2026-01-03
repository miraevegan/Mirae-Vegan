import mongoose from "mongoose";

const heroSchema = new mongoose.Schema(
  {
    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },

    /**
     * For images → multiple
     * For video → single item array
     */
    media: [
      {
        publicId: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Hero", heroSchema);
