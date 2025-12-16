"use client";

import Link from "next/link";
import { MoveRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import FeaturedBestSellerCard from "@/components/product/FeaturedProductCard";

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
  isBestSeller?: boolean;
};

type BestSellerProps = {
  products: Product[];
};

export default function BestSeller({ products }: BestSellerProps) {
  if (!products || products.length === 0) return null;

  const [featuredProduct, ...rest] = products;
  const gridProducts = rest.slice(0, 4);

  return (
    <section className="px-10 py-20 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-[40px] uppercase font-highlight text-brand-primary">
          Best Sellers
        </h2>

        <Link
          href="/shop?filter=best-seller"
          className="inline-flex items-center gap-3 px-6 py-3 text-sm tracking-widest transition border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-background"
        >
          View All Products
          <MoveRight className="w-5 h-5 stroke-[1.5]" />
        </Link>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Featured */}
        <div className="lg:col-span-1">
          <FeaturedBestSellerCard product={featuredProduct} />
        </div>

        {/* Grid (2x2) */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2">
          {gridProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
