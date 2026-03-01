"use client";

import React, { useState, useEffect } from "react";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MoveRight } from "lucide-react";
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

export default function JustLanded({ products }: JustLandedProps) {
  const [page, setPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(3);

  /* ✅ SSR-safe responsive logic */
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setIsMobile(true);
        setItemsPerView(1);
      } else if (width < 1024) {
        setIsMobile(false);
        setItemsPerView(2);
      } else {
        setIsMobile(false);
        setItemsPerView(3);
      }
    };

    handleResize(); // initial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerView);
  const maxPage = Math.max(totalPages - 1, 0);

  return (
    <motion.section
      id="just-landed"
      className="mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-16"
      variants={sectionFade}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
    >
      {/* Header */}
      <motion.div
        className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-8"
        variants={headerReveal}
      >
        <h2 className="text-3xl sm:text-4xl uppercase font-highlight text-brand-primary">
          Just Landed
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

      {/* Slider */}
      <div className="relative">
        <div className={isMobile ? "overflow-x-auto no-scrollbar" : "overflow-hidden"}>
          <motion.div
            className={`flex ${isMobile ? "snap-x snap-mandatory" : ""}`}
            style={
              isMobile
                ? undefined
                : { transform: `translateX(-${page * 100}%)` }
            }
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {products.map((product) => (
              <div
                key={product._id}
                className={`
                  shrink-0 px-2
                  ${isMobile
                    ? "w-[85%] snap-start"
                    : "w-full sm:w-1/2 lg:w-1/3"}
                `}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Desktop arrows */}
        {!isMobile && page > 0 && (
          <button
            onClick={() => setPage((p) => p - 1)}
            className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-10 bg-border/90 shadow-xl hidden sm:flex items-center justify-center"
          >
            <ChevronLeft />
          </button>
        )}

        {!isMobile && page < maxPage && (
          <button
            onClick={() => setPage((p) => p + 1)}
            className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 h-24 w-10 bg-border/90 shadow-xl hidden sm:flex items-center justify-center"
          >
            <ChevronRight />
          </button>
        )}
      </div>
    </motion.section>
  );
}
