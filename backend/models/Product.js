import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    images: {
      type: [String],
      default: [],
    },

    color: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // Packed weight in grams (used for shipping). Empty = default weight from .env
    weightGrams: {
      type: Number,
      min: 0,
      default: null,
    },

    variants: [
      {
        age: {
          type: String,
          required: true,
          trim: true,
        },

        stock: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    // Where the product shows up on the store (multiple allowed):
    // "global" = main Shop/Home, "women-wear" = Women Wear page, "twinning" = Twinning Sets page
    placements: {
      type: [{ type: String, enum: ["global", "women-wear", "twinning"] }],
      default: ["global"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);