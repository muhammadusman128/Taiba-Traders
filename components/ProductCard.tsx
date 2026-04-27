"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600"] });

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
    <article className={`group relative w-full aspect-[4/3] overflow-hidden bg-[#f0f0f0] rounded-xl ${inter.className}`}>
      <Link href={`/products/${product._id}`} className="absolute inset-0 block">

        {/* Primary Image */}
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
                alt={`${product.name} alternate`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover opacity-0 transition-opacity duration-700 ease-out absolute inset-0 group-hover:opacity-100"
              />
            )}
          </div>
        )}

        {/* Bottom overlay — appears on hover */}
        <div className="absolute inset-x-0 bottom-0 h-28 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)" }}
        />

        {/* Name + Arrow — slide up on hover */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-4 pb-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-out">
          <h3 className="text-white text-sm font-semibold leading-snug line-clamp-2 max-w-[75%] drop-shadow">
            {product.name}
          </h3>
          <span className="flex-shrink-0 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-lg">
            <FiArrowRight size={16} className="text-gray-900" />
          </span>
        </div>

      </Link>
    </article>
  );
}
