"use client";

import { MoveRight } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section
      className="flex items-center justify-center w-full min-h-[80vh] sm:min-h-[90vh] bg-center bg-cover px-4"
      style={{ backgroundImage: "url('/images/hero_image.jpg')" }}
    >
      <motion.div
        className="max-w-5xl text-center"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.18,
            },
          },
        }}
      >
        {/* BRAND NAME */}
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 1.2, ease: "easeOut" },
            },
          }}
          className="
            font-light font-brand text-background leading-none
            text-[72px]
            sm:text-[96px]
            md:text-[120px]
            lg:text-[140px]
          "
        >
          Miraé
        </motion.h1>

        {/* TAGLINE */}
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 1.1, ease: "easeOut" },
            },
          }}
          className="
            font-extralight font-brand text-background
            mt-2
            mb-16
            sm:mb-24
            lg:mb-32
            text-lg
            sm:text-xl
            md:text-2xl
            lg:text-3xl
          "
        >
          Conscious & Timeless
        </motion.p>

        {/* CTA */}
        <motion.button
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 1, ease: "easeOut" },
            },
          }}
          whileHover={{ x: 4 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="
            inline-flex items-center gap-3
            px-5 py-3
            sm:px-6
            text-xs
            sm:text-sm
            tracking-widest
            transition
            border border-background
            text-background
            hover:bg-background hover:text-brand-primary
          "
        >
          <MoveRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
          NEW ARRIVALS IN STORE
        </motion.button>
      </motion.div>
    </section>
  );
}
