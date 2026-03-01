"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import type { Product } from "@/types/product";

const FALLBACK_IMAGE = "/images/placeholder-product.jpg";

function getBasePrice(product: Product): number {
  if (product.variants && product.variants.length > 0) {
    return Math.min(...product.variants.map((v) => v.price));
  }
  return 0;
}

function getDiscountedPrice(basePrice: number, percentage?: number) {
  if (!percentage || percentage <= 0) return basePrice;
  return Math.round(basePrice * (1 - percentage / 100));
}

function getInStockVariants(product: Product) {
  return product.variants?.filter((v) => v.stock > 0) ?? [];
}

function getTotalStock(product: Product) {
  return product.variants?.reduce((sum, v) => sum + v.stock, 0) ?? 0;
}

export default function FeaturedBestSellerCard({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const imageSrc = product.images?.[0]?.url || FALLBACK_IMAGE;

  const basePrice = getBasePrice(product);
  const discountPercentage = product.discount?.percentage ?? 0;
  const finalPrice = getDiscountedPrice(basePrice, discountPercentage);

  const hasDiscount = discountPercentage > 0 && finalPrice < basePrice;

  const inStockVariants = getInStockVariants(product);
  const isOutOfStock = inStockVariants.length === 0;
  const canDirectAdd = inStockVariants.length === 1;

  const totalStock = getTotalStock(product);
  const isLowStock = totalStock === 1 && !isOutOfStock;

  const tags = [
    product.isJustLanded && "NEW IN",
    product.isBestSeller && "BEST SELLER",
    product.isVegan && "VEGAN",
  ].filter(Boolean) as string[];

  const selectedVariant = inStockVariants[0]; // Default variant for wishlist and add to cart

  const wishlisted = selectedVariant
    ? isWishlisted(product._id, selectedVariant._id)
    : false;

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      showToast("This product is out of stock", "error");
      return;
    }

    if (canDirectAdd) {
      const variant = inStockVariants[0];
      await addToCart(product._id, 1, variant._id);
      showToast("Added to cart 🛒", "success");
      return;
    }

    router.push(`/products/${product.slug}`);
  };

  const handleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showToast("Please login to use wishlist", "info");
      return;
    }

    if (!selectedVariant) {
      showToast("No variant available to wishlist", "error");
      return;
    }

    toggleWishlist(product, selectedVariant);

    showToast(
      wishlisted ? "Removed from wishlist" : "Added to wishlist ❤️",
      "success"
    );
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="flex flex-col w-full h-full group"
      aria-label={`View details for ${product.name}`}
    >
      {/* Image */}
      <div className="relative w-full flex-1 overflow-hidden bg-surface">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          className={`object-cover transition-transform duration-700 ${isOutOfStock ? "opacity-60 grayscale" : "group-hover:scale-105"
            }`}
        />

        {/* Tags */}
        {(tags.length > 0 || isOutOfStock || isLowStock) && (
          <div className="absolute z-10 flex flex-wrap gap-2 top-4 left-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className={`px-3 py-1 text-xs tracking-widest uppercase text-white
                  ${tag === "VEGAN" ? "bg-brand-primary" : "bg-black"}
                `}
              >
                {tag === "VEGAN" ? "VEGAN 🌱" : tag}
              </span>
            ))}

            {isLowStock && (
              <span className="px-3 py-1 text-xs tracking-widest uppercase text-white bg-orange-600">
                Only 1 left
              </span>
            )}

            {isOutOfStock && (
              <span className="px-3 py-1 text-xs tracking-widest uppercase text-white bg-gray-700">
                Out of stock
              </span>
            )}
          </div>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute z-10 p-2 rounded-full top-4 right-4 bg-white/70 backdrop-blur hover:bg-white"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-5 w-5 transition ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-700"
              }`}
          />
        </button>

        {/* Add to Cart */}
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className={`absolute z-10 flex items-center gap-2 px-5 py-2 text-sm text-white bottom-4 right-4 transition
            ${isOutOfStock
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black opacity-0 group-hover:opacity-100"
            }`}
          aria-label="Add to cart"
        >
          <ShoppingBag className="w-4 h-4" />
          {canDirectAdd ? "Add" : "Select"}
        </button>
      </div>

      {/* Info */}
      <div className="flex items-center justify-between mt-4">
        <h3 className="text-sm font-medium line-clamp-1">{product.name}</h3>

        <p className="text-sm font-semibold text-brand-primary">
          {hasDiscount ? (
            <>
              <span className="mr-2 text-gray-400 line-through">₹{basePrice}</span>
              <span>₹{finalPrice}</span>
            </>
          ) : (
            <>₹{basePrice}</>
          )}
        </p>
      </div>
    </Link>
  );
}
