"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "next/navigation";

const FALLBACK_IMAGE = "/images/placeholder-product.jpg";

function getBasePrice(product: Product): number {
  if (product.variants && product.variants.length > 0) {
    return Math.min(...product.variants.map(v => v.price));
  }
  return 0;
}

function getDiscountedPrice(basePrice: number, percentage?: number) {
  if (!percentage || percentage <= 0) return basePrice;
  return Math.round(basePrice * (1 - percentage / 100));
}

function getInStockVariants(product: Product) {
  return product.variants?.filter(v => v.stock > 0) ?? [];
}

function getTotalStock(product: Product) {
  return product.variants?.reduce((sum, v) => sum + v.stock, 0) ?? 0;
}

type ProductCardProps = {
  product: Product;
  size?: "default" | "compact";
};

export default function ProductCard({ 
  product, 
  size = "default" 
}: ProductCardProps) {

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

  const selectedVariant = inStockVariants[0];

  const wishlisted = selectedVariant
    ? isWishlisted(product._id, selectedVariant._id)
    : false;

  const handleAddToCart = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
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

  const isCompact = size === "compact";

  return (
    <Link
      href={`/products/${product.slug}`}
      className="block w-full group"
      aria-label={`View details for ${product.name}`}
    >
      {/* Image */}
      <div
        className={`
          relative w-full overflow-hidden bg-surface aspect-square
        `}
      >
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className={`
            object-cover transition duration-500
            ${isOutOfStock
              ? "opacity-60 grayscale"
              : isCompact
              ? "group-hover:scale-102"
              : "group-hover:scale-105"
            }
          `}
        />

        {/* Tags */}
        {(tags.length > 0 || isOutOfStock || isLowStock) && (
          <div className="absolute z-10 flex flex-wrap gap-2 top-3 left-3">
            {tags.map(tag => (
              <span
                key={tag}
                className={`
                  px-2 py-1 tracking-widest uppercase text-white
                  ${isCompact ? "text-[9px]" : "text-[10px]"}
                  ${tag === "VEGAN"
                    ? "bg-brand-primary"
                    : "bg-black"
                  }
                `}
              >
                {tag}
              </span>
            ))}

            {isLowStock && (
              <span className="px-2 py-1 text-[9px] tracking-widest uppercase text-white bg-orange-600">
                Only 1 left
              </span>
            )}

            {isOutOfStock && (
              <span className="px-2 py-1 text-[9px] tracking-widest uppercase text-white bg-gray-700">
                Out of stock
              </span>
            )}
          </div>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute z-10 p-2 rounded-full top-3 right-3 bg-white/70 hover:bg-white"
        >
          <Heart
            className={`h-5 w-5 transition ${
              wishlisted
                ? "fill-red-500 text-red-500"
                : "text-gray-700"
            }`}
          />
        </button>

        {/* Add to Cart */}
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className={`
            absolute z-10 flex items-center gap-2 text-white bottom-3 right-3 transition
            ${isCompact ? "px-3 py-1 text-[10px]" : "px-4 py-2 text-xs"}
            ${isOutOfStock
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black opacity-0 group-hover:opacity-100"
            }
          `}
        >
          <ShoppingBag className="w-4 h-4" />
          {canDirectAdd ? "Add" : "Select"}
        </button>
      </div>

      {/* Info */}
      <div className="flex items-center justify-between mt-4">
        <h3
          className={`
            font-medium line-clamp-1
            ${isCompact ? "text-xs" : "text-sm"}
          `}
        >
          {product.name}
        </h3>

        <p
          className={`
            font-semibold text-brand-primary
            ${isCompact ? "text-xs" : "text-sm"}
          `}
        >
          {hasDiscount ? (
            <>
              <span className="mr-2 text-gray-400 line-through">
                ₹{basePrice}
              </span>
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