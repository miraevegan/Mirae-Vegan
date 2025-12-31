"use client";

import React, { useState, useMemo } from "react";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MoveRight } from "lucide-react";
// import { useToast } from "@/context/ToastContext";
// import { useCart } from "@/context/CartContext";
// import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import type { Product } from "@/types/product";

type JustLandedProps = {
  products: Product[];
};

const easeOut = [0.16, 1, 0.3, 1] as const;

const sectionFade: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: easeOut },
  },
};

const headerReveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: easeOut },
  },
};

const sliderContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const productItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
};

export default function JustLanded({ products }: JustLandedProps) {
  const [page, setPage] = useState(0);
  // const { showToast } = useToast();
  // const { addToCart } = useCart();
  // const { user } = useAuth();
  // const router = useRouter();

  const itemsPerView = useMemo(() => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerView);
  const maxPage = Math.max(totalPages - 1, 0);

  const next = () => page < maxPage && setPage((p) => p + 1);
  const prev = () => page > 0 && setPage((p) => p - 1);

  // const handleAddToCart = async (product: Product) => {
  //   if (!user) {
  //     localStorage.setItem(
  //       "pendingCartItem",
  //       JSON.stringify({ productId: product._id, quantity: 1 })
  //     );
  //     showToast("Please login to continue", "info");
  //     router.push("/login");
  //     return;
  //   }

  //   try {
  //     await addToCart(product._id, 1);
  //     showToast(`${product.name} added to cart`, "success");
  //   } catch {
  //     showToast("Failed to add item to cart", "error");
  //   }
  // };

  return (
    <motion.section
      id="just-landed"
      className="mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-16"
      variants={sectionFade}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
    >
      <motion.div
        className="flex flex-col gap-6 sm:flex-row items-center justify-center sm:justify-between mb-8"
        variants={headerReveal}
      >
        <h2 className="text-3xl sm:text-4xl uppercase font-highlight text-brand-primary">
          Just Landed
        </h2>

        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-3
            px-5 py-3 w-full sm:w-96
            text-xs sm:text-sm
            tracking-widest
            transition
            border border-brand-primary
            text-brand-primary
            hover:bg-brand-primary hover:text-background"
        >
          View All Products
          <MoveRight className="w-5 h-5 stroke-[1.5]" />
        </Link>
      </motion.div>

      <div className="relative">
        <div className="overflow-hidden">
          <motion.div
            className="flex"
            style={{ transform: `translateX(-${page * 100}%)` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            variants={sliderContainer}
            initial="hidden"
            animate="visible"
          >
            {products.map((product) => (
              <motion.div
                key={product._id}
                className="shrink-0 w-full sm:w-1/2 lg:w-1/3"
                variants={productItem}
              >
                <ProductCard
                  product={product}
                // onAddToCart={() => handleAddToCart(product)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {page > 0 && (
          <motion.button
            onClick={prev}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 h-24 w-10 bg-border/90 hover:bg-border shadow-xl hidden sm:flex items-center justify-center"
            aria-label="Previous products"
          >
            <ChevronLeft />
          </motion.button>
        )}

        {page < maxPage && (
          <motion.button
            onClick={next}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 top-1/2 z-20 translate-x-1/2 -translate-y-1/2 h-24 w-10 bg-border/90 hover:bg-border shadow-xl hidden sm:flex items-center justify-center"
            aria-label="Next products"
          >
            <ChevronRight />
          </motion.button>
        )}
      </div>
    </motion.section>
  );
}
