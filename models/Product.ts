import mongoose, { Schema, Document, Model } from "mongoose";
import "./Category";

export interface IReview extends Document {
  name: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: mongoose.Types.ObjectId;
  images: string[];
  brand?: string;
  ratings: number;
  numReviews: number;
  reviews: IReview[];
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    images: {
      type: [String],
      default: [],
    },
    brand: {
      type: String,
    },
    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [ReviewSchema],
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Clear mongoose models cache in development to ensure schema updates take effect
if (process.env.NODE_ENV !== "production") {
  delete mongoose.models.Product;
}

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
