"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  FiShoppingCart,
  FiMinus,
  FiPlus,
  FiShare2,
  FiTruck,
  FiStar,
  FiTrash2,
} from "react-icons/fi";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import axios from "axios";

function ProductSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white animate-pulse">
      <div className="h-4 w-24 bg-gray-50 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="h-105 sm:h-140 bg-gray-50 border border-gray-100" />
          <div className="mt-4 grid grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-50 border border-gray-100" />
            ))}
          </div>
        </div>
        <div className="space-y-4 pt-2">
          <div className="h-5 w-24 bg-gray-50" />
          <div className="h-9 w-4/5 bg-gray-50" />
          <div className="h-6 w-1/3 bg-gray-50" />
          <div className="h-24 w-full bg-gray-50" />
          <div className="h-12 w-full bg-gray-50" />
        </div>
      </div>
    </div>
  );
}

interface ProductClientProps {
  productId: string;
}

export default function ProductClient({ productId }: ProductClientProps) {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [sharePopup, setSharePopup] = useState<string | null>(null);
  const shareTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  useEffect(() => {
    setSelectedImage(0);
  }, [product?._id]);

  const fetchProduct = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await axios.get(`/api/products/${productId}`);
      setProduct(res.data);
    } catch (error) {
      console.error("Error fetching product:", error);
      setProduct(null);
      setErrorMessage(
        "Product not found or unavailable right now. Please try again.",
      );
    }
    setIsLoading(false);
  };

  const heroImage =
    product?.images?.[selectedImage] || product?.images?.[0] || "/logo.png";

  const handleAddToCart = () => {
    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0] || "",
    });
    toast.success(`Added ${quantity} item(s) to cart!`);
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (!url) return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        toast.success("Link copied");
      }
    } catch (_err) {
      toast.error("Failed to copy link");
    }

    if (shareTimeoutRef.current) {
      clearTimeout(shareTimeoutRef.current);
    }
    setSharePopup(url);
    shareTimeoutRef.current = setTimeout(() => setSharePopup(null), 2000);
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment || reviewRating < 1 || reviewRating > 5) {
      toast.error("Please provide a valid name, rating, and comment.");
      return;
    }
    setIsSubmittingReview(true);
    try {
      const res = await axios.post(`/api/products/${productId}/reviews`, {
        name: reviewName,
        rating: reviewRating,
        comment: reviewComment,
      });
      toast.success("Review submitted successfully!");
      setProduct(res.data.product);
      setReviewName("");
      setReviewComment("");
      setReviewRating(5);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await axios.delete(
        `/api/products/${productId}/reviews?reviewId=${reviewId}`
      );
      toast.success("Review deleted");
      setProduct(res.data.product);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete review");
    }
  };

  useEffect(() => {
    return () => {
      if (shareTimeoutRef.current) clearTimeout(shareTimeoutRef.current);
    };
  }, []);

  if (isLoading) {
    return <ProductSkeleton />;
  }

  if (errorMessage || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <p className="text-lg font-semibold text-neutral-800">
          {errorMessage || "Product not found."}
        </p>
        <div className="mt-4 flex gap-3">
          <button
            onClick={fetchProduct}
            className="px-4 py-2 rounded-full bg-black text-white hover:bg-neutral-900"
          >
            Retry
          </button>
          <button
            onClick={() => router.push("/products")}
            className="px-4 py-2 rounded-full border border-neutral-300 text-neutral-800 hover:border-neutral-500"
          >
            Back to products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.push("/products")}
          className="inline-flex items-center text-[10px] font-semibold text-gray-500 uppercase tracking-widest hover:text-black hover:border-black border-b border-transparent transition-colors mb-8 cursor-pointer pb-0.5"
        >
          &larr; Back to products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-4/5 overflow-hidden border-b border-gray-100">
              {heroImage && (
                <Image
                  src={heroImage}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1 mt-6">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden cursor-pointer transition-all ${
                      selectedImage === index
                        ? "border-b-2 border-black opacity-100"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    {image && (
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-contain"
                        sizes="80px"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:pt-2">
            <div className="max-w-xl space-y-5">
              <div>
                {product.brand && (
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-3">
                    {product.brand}
                  </p>
                )}
                <h1 className="text-xl sm:text-3xl font-light text-gray-900 leading-tight tracking-tight">
                  {product.name}
                </h1>
                <p className="mt-6 text-sm text-gray-500 font-light leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-2">
                  Price
                </p>
                <p className="text-2xl sm:text-3xl font-light text-gray-900 tracking-tight">
                  {formatPrice(product.price)}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-3">
                    Quantity
                  </p>
                  <div className="inline-flex flex-row items-center border border-gray-200 bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="cursor-pointer h-10 w-10 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-gray-900 border-x border-gray-200">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="cursor-pointer h-10 w-10 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 relative pt-6 border-t border-gray-100">
                {sharePopup && (
                  <div className="absolute -top-14 left-0 bg-black text-white px-3 py-2 text-[10px] uppercase tracking-widest max-w-full">
                    <p className="font-semibold">Link copied</p>
                  </div>
                )}
                <button
                  onClick={handleShare}
                  className="inline-flex items-center justify-center gap-2 cursor-pointer border border-gray-200 px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-gray-900 hover:border-black transition-colors bg-white hover:bg-gray-50"
                >
                  <FiShare2 size={16} />
                  <span>Share</span>
                </button>
                <button
                  onClick={handleAddToCart}
                  className="inline-flex flex-1 items-center justify-center cursor-pointer gap-2 bg-black text-white text-[10px] font-semibold uppercase tracking-widest py-3 hover:bg-gray-900 transition-colors"
                >
                  <FiShoppingCart size={16} />
                  <span>Add to Cart</span>
                </button>
              </div>

              {/* Delivery Estimate */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 text-gray-400">
                    <FiTruck size={22} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-1">
                      Standard Delivery
                    </h4>
                    <p className="text-sm font-light text-gray-500">
                      Delivered within 3 - 5 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-20 pt-12 border-t border-gray-100 max-w-4xl mx-auto">
          <h2 className="text-2xl font-light tracking-tight text-gray-900 mb-8">
            Customer Reviews
            <span className="ml-3 text-sm text-gray-400 font-medium">({product.reviews?.length || 0})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-5 order-2 md:order-1">
              <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                <h3 className="text-sm uppercase tracking-widest font-semibold text-gray-900 mb-6">Write a Review</h3>
                <form onSubmit={submitReview} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className={`focus:outline-none transition-colors cursor-pointer ${
                            star <= reviewRating ? "text-yellow-400" : "text-gray-200"
                          }`}
                        >
                          <FiStar size={24} fill={star <= reviewRating ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-black bg-white transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Review</label>
                    <textarea
                      required
                      rows={4}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-black bg-white transition-colors resize-none"
                      placeholder="Share your thoughts about this product..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="w-full bg-black text-white px-6 py-3.5 rounded-xl text-[10px] uppercase tracking-widest font-semibold hover:bg-gray-900 transition-colors disabled:opacity-50"
                  >
                    {isSubmittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
            </div>

            <div className="md:col-span-7 order-1 md:order-2">
              <div className="space-y-6">
                {!product.reviews || product.reviews.length === 0 ? (
                  <div className="text-center py-12 px-4 bg-gray-50/30 rounded-2xl border border-gray-100 border-dashed">
                    <p className="text-gray-500 font-light">No reviews yet. Be the first to share your experience!</p>
                  </div>
                ) : (
                  product.reviews.map((review: any) => (
                    <div key={review._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative group transition-all hover:shadow-md">
                      {isAdmin && (
                        <button
                          onClick={() => deleteReview(review._id)}
                          className="absolute top-6 right-6 text-gray-300 hover:text-red-500 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                          title="Delete Review (Admin)"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      )}
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            size={14}
                            className={i < review.rating ? "text-yellow-400" : "text-gray-200"}
                            fill={i < review.rating ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">{review.name}</h4>
                      <p className="text-xs text-gray-400 font-light mb-3">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-gray-600 font-light text-sm leading-relaxed whitespace-pre-wrap">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
