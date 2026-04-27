"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Tenor_Sans } from "next/font/google";
import { FiArrowRight } from "react-icons/fi";

const tenorSans = Tenor_Sans({ subsets: ["latin"], weight: "400" });

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug?: string;
    price: number;
    newPrice?: number;
    oldPrice?: number;
    originalPrice?: number;
    images: string[];
    ratings?: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.[0] || "";
  const hoverImage = product.images?.[1] || primaryImage;
  const hasHoverImage = Boolean(product.images?.[1]);

  return (
    <article className="group relative w-full aspect-[4/5] overflow-hidden bg-[#f8f9fa] border border-zinc-100 transition-colors duration-300">
      <Link
        href={`/products/${product._id}`}
        className="absolute inset-0 w-full h-full block"
      >
        {/* Images Container */}
        {primaryImage && (
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                hasHoverImage ? "group-hover:opacity-0" : ""
              }`}
            />
            {hasHoverImage && (
              <Image
                src={hoverImage}
                alt={`${product.name} alternate view`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover opacity-0 transition-opacity duration-700 ease-out absolute inset-0 group-hover:opacity-100"
              />
            )}
          </div>
        )}

        {/* Hover Overlay with Title and View More */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-4 z-10 text-center">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out flex flex-col items-center gap-3">
            <h3
              className={`text-white text-lg sm:text-xl drop-shadow-sm line-clamp-3 leading-snug px-2 ${tenorSans.className}`}
            >
              {product.name}
            </h3>
            <span className="text-white/80 text-[10px] uppercase tracking-[0.25em] font-light flex items-center gap-1.5 mt-3 transition-colors hover:text-white">
              View More{" "}
              <FiArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
