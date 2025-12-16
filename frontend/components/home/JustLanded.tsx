"use client";

import React, { useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MoveRight } from "lucide-react";
import { useToast } from "@/context/ToastContext"; // If you have toast context
import { useCart } from "@/context/CartContext";

type ProductImage = {
  url: string;
  public_id?: string;
};

type Product = {
  _id: string;
  name: string;
  price: number;
  images?: ProductImage[];
  slug?: string;
  isJustLanded?: boolean;
  isBestSeller?: boolean;
};

type JustLandedProps = {
  products: Product[];
};

const ITEMS_PER_VIEW = 3;

export default function JustLanded({ products }: JustLandedProps) {
  const [page, setPage] = useState(0);
  const { showToast } = useToast();
  const { addToCart } = useCart();

  const maxPage = Math.max(Math.ceil(products.length / ITEMS_PER_VIEW) - 1, 0);

  const next = () => page < maxPage && setPage((p) => p + 1);
  const prev = () => page > 0 && setPage((p) => p - 1);

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product._id, 1); // Use context method here
      showToast(`${product.name} added to cart`, "success");
    } catch (error) {
      showToast("Failed to add item to cart", "error");
    }
  };

  return (
    <section className="px-10 py-16 mx-auto" id="just-landed">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[40px] uppercase font-highlight text-brand-primary">
          Just Landed
        </h2>

        <Link
          href="/shop"
          className="inline-flex items-center gap-3 px-6 py-3 text-sm tracking-widest transition border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-background"
        >
          View All Products
          <MoveRight className="w-5 h-5 stroke-[1.5]" />
        </Link>
      </div>

      {/* Slider Wrapper */}
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${page * 100}%)`,
            }}
          >
            {products.map((product) => (
              <div key={product._id} className="w-1/3 shrink-0">
                <ProductCard
                  product={{
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    images: product.images,
                    slug: product.slug,
                    isJustLanded: product.isJustLanded,
                    isBestSeller: product.isBestSeller,
                  }}
                  onAddToCart={() => handleAddToCart(product)}
                />
              </div>
            ))}
          </div>
        </div>

        {page > 0 && (
          <button
            onClick={prev}
            className="absolute left-0 z-20 flex items-center justify-center w-10 -translate-x-1/2 -translate-y-1/2 shadow-xl h-28 top-1/2 bg-border/90 hover:bg-border"
            aria-label="Previous products"
          >
            <ChevronLeft />
          </button>
        )}

        {page < maxPage && (
          <button
            onClick={next}
            className="absolute right-0 z-20 flex items-center justify-center w-10 translate-x-1/2 -translate-y-1/2 shadow-xl h-28 top-1/2 bg-border/90 hover:bg-border"
            aria-label="Next products"
          >
            <ChevronRight />
          </button>
        )}
      </div>
    </section>
  );
}
