"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";

type ProductImage = {
    url: string;
    public_id?: string;
};

type Product = {
    _id: string | number;
    name: string;
    price: number;
    images?: ProductImage[];
    slug?: string;
    isBestSeller?: boolean;
};

type Props = {
    product: Product;
    onAddToCart?: (product: Product) => void;
    onToggleWishlist?: (product: Product) => void;
    isWishlisted?: boolean;
};

const FALLBACK_IMAGE = "/images/placeholder-product.jpg";

export default function FeaturedBestSellerCard({
    product,
    onAddToCart,
    onToggleWishlist,
    isWishlisted = false,
}: Props) {
    const imageSrc =
        product.images && product.images.length > 0
            ? product.images[0].url
            : FALLBACK_IMAGE;

    return (
        <Link
            href={`/products/${product.slug || product._id}`}
            className="block w-full h-full group"
            aria-label={`View details for ${product.name}`}
        >
            {/* Image */}
            <div className="relative w-full overflow-hidden aspect-4/5 bg-surface">
                <Image
                    src={imageSrc}
                    alt={product.name || "Product image"}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Tag */}
                <div className="absolute z-10 top-4 left-4">
                    <span className="px-3 py-1 text-xs tracking-widest text-white uppercase bg-black">
                        Best Seller
                    </span>
                </div>

                {/* Wishlist */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onToggleWishlist?.(product);
                    }}
                    className="absolute z-10 p-2 transition rounded-full cursor-pointer top-4 right-4 bg-white/70 backdrop-blur hover:bg-white"
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <Heart
                        className={`h-5 w-5 transition ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-700"
                            }`}
                    />
                </button>

                {/* Add to Cart — HOVER ONLY (fixed) */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onAddToCart?.(product);
                    }}
                    className="absolute z-10 flex items-center gap-2 px-5 py-2 text-sm text-white transition-all translate-y-3 bg-black opacity-0 cursor-pointer bottom-4 right-4 group-hover:opacity-100 group-hover:translate-y-0"
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
