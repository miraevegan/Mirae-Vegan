"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";

type ProductImage = {
  url: string;
  public_id?: string;
};

type Product = {
  id: string | number;
  name: string;
  price: number;
  images?: ProductImage[];
  slug?: string;
  isJustLanded?: boolean;
  isBestSeller?: boolean;
};

type ProductCardProps = {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
};

const FALLBACK_IMAGE = "/images/placeholder-product.jpg";

export default function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
}: ProductCardProps) {
  const imageSrc =
    product.images && product.images.length > 0
      ? product.images[0].url
      : FALLBACK_IMAGE;

  const tags = [
    product.isJustLanded && "NEW IN",
    product.isBestSeller && "Best Seller",
  ].filter(Boolean) as string[];

  return (
    <Link
      href={`/products/${product.slug || product.id}`}
      className="block w-full group"
      aria-label={`View details for ${product.name}`}
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden aspect-square bg-surface">
        <Image
          src={imageSrc}
          alt={product.name || "Product image"}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          priority={false}
        />

        {/* Tags */}
        {tags.length > 0 && (
          <div className="absolute z-10 flex gap-2 top-3 left-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-[10px] tracking-widest uppercase text-white bg-black"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist?.(product);
          }}
          className="absolute z-10 p-2 transition rounded-full cursor-pointer top-3 right-3 bg-white/70 backdrop-blur hover:bg-white"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-5 w-5 transition ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-gray-700"
            }`}
          />
        </button>

        {/* Add to Cart */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToCart?.(product);
          }}
          className="absolute z-10 flex items-center gap-2 px-4 py-2 text-xs text-white transition-all translate-y-2 bg-black opacity-0 cursor-pointer bottom-3 right-3 group-hover:opacity-100 group-hover:translate-y-0"
          aria-label="Add to cart"
        >
          <ShoppingBag className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Info */}
      <div className="flex items-center justify-between mt-4">
        <h3 className="text-sm font-medium text-text-primary line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm font-semibold text-brand-primary">
          ₹{product.price}
        </p>
      </div>
    </Link>
  );
}
