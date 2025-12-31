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
        py-14
        sm:py-16
        lg:py-20
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
          sm:flex-row sm:items-center sm:justify-between
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
            sm:text-4xl
          "
        >
          Best Sellers
        </h2>

        <Link
          href="/shop?filter=best-seller"
          className="
            inline-flex items-center gap-3
            px-5 py-3
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

      {/* Layout */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Featured */}
        <motion.div
          className="lg:col-span-1"
          variants={featuredReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <FeaturedBestSellerCard product={featuredProduct} />
        </motion.div>

        {/* Grid */}
        <motion.div
          className="
            grid grid-cols-1 gap-6
            sm:grid-cols-2
            lg:col-span-2
          "
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
