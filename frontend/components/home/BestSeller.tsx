"use client";

import Link from "next/link";
import { MoveRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import FeaturedBestSellerCard from "@/components/product/FeaturedProductCard";
import { motion, type Variants } from "framer-motion";
import type { Product } from "@/types/product";

type BestSellerProps = {
  products: Product[];
};

/* ---------------------------
   Motion variants (unchanged)
---------------------------- */

const easeOut = [0.16, 1, 0.3, 1] as const;

const sectionFade: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: easeOut },
  },
};

const featuredReveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: easeOut },
  },
};

const gridContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const gridItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
};

/* ---------------------------
   Component
---------------------------- */

export default function BestSeller({ products }: BestSellerProps) {
  if (!products || products.length === 0) return null;

  const [featuredProduct, ...rest] = products;
  const gridProducts = rest.slice(0, 4);

  return (
    <motion.section
      className="
        mx-auto
        px-4
        sm:px-6
        lg:px-10
        pt-8
        lg:pt-10
        pb-14
        sm:pb-18
        lg:pb-24
      "
      variants={sectionFade}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
    >
      {/* Header */}
      <motion.div
        className="
          flex flex-col gap-6
          sm:flex-row items-center justify-center sm:justify-between
          mb-10
        "
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: easeOut }}
      >
        <h2
          className="
            uppercase font-highlight text-brand-primary
            text-3xl
            sm:text-4xl w-full
          "
        >
          Best Sellers
        </h2>

        <Link
          href="/shop?filter=best-seller"
          className="
            inline-flex items-center justify-center gap-3
            px-5 py-3 w-full sm:w-96
            text-xs sm:text-sm
            tracking-widest
            transition
            border border-brand-primary
            text-brand-primary
            hover:bg-brand-primary hover:text-background
          "
        >
          View All Products
          <MoveRight className="w-5 h-5 stroke-[1.5]" />
        </Link>
      </motion.div>

      {/* MOBILE / TABLET SLIDER */}
      <div className="lg:hidden overflow-x-auto no-scrollbar">
        <div className="flex snap-x snap-mandatory">
          {products.map((product) => (
            <div
              key={product._id}
              className="w-[90%] px-2 sm:w-1/2 shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* DESKTOP EDITORIAL LAYOUT */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8 items-stretch">

        {/* LEFT - Featured */}
        <motion.div
          className="h-full"
          variants={featuredReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <FeaturedBestSellerCard product={featuredProduct} />
        </motion.div>

        {/* RIGHT - Products Grid */}
        <motion.div
          className="grid grid-cols-2 gap-6"
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {gridProducts.map((product) => (
            <motion.div key={product._id} variants={gridItem}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
