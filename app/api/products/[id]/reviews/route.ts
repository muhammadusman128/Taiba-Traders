import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { name, rating, comment } = await req.json();

    if (!name || !rating || !comment) {
      return NextResponse.json({ error: "Please provide name, rating, and comment." }, { status: 400 });
    }

    // Also support adding by slug or id, just like the GET route
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    let product = isObjectId ? await Product.findById(id) : null;
    
    if (!product) {
      product = await Product.findOne({ slug: id.toLowerCase() });
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const review = {
      name,
      rating: Number(rating),
      comment,
    };

    if (!product.reviews) {
      product.reviews = [];
    }

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    
    // Return updated product with price aliases for frontend compatibility
    const plain = typeof product.toObject === "function" ? product.toObject() : product;
    const withAliases = {
        ...plain,
        newPrice: plain.price,
        oldPrice: plain.originalPrice,
    };

    return NextResponse.json({ message: "Review added", product: withAliases }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add review" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    await connectDB();
    const { id } = await params;
    const url = new URL(req.url);
    const reviewId = url.searchParams.get("reviewId");

    if (!reviewId) {
      return NextResponse.json({ error: "Review ID required" }, { status: 400 });
    }

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    let product = isObjectId ? await Product.findById(id) : null;
    
    if (!product) {
      product = await Product.findOne({ slug: id.toLowerCase() });
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (!product.reviews) {
      product.reviews = [];
    }

    product.reviews = product.reviews.filter((x: any) => x._id.toString() !== reviewId);
    product.numReviews = product.reviews.length;
    
    if (product.reviews.length > 0) {
      product.ratings =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
    } else {
      product.ratings = 0;
    }

    await product.save();
    
    // Return updated product
    const plain = typeof product.toObject === "function" ? product.toObject() : product;
    const withAliases = {
        ...plain,
        newPrice: plain.price,
        oldPrice: plain.originalPrice,
    };

    return NextResponse.json({ message: "Review deleted", product: withAliases }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
