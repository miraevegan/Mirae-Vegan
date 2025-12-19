"use client";

import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { motion, type Variants } from "framer-motion";

type Props = {
  title: string;
  image: string;
  href: string;
  buttonText?: string;
};

/* ---------------------------
   Motion variants
---------------------------- */

const easeOut = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const imageReveal: Variants = {
  hidden: { scale: 1.08 },
  visible: {
    scale: 1,
    transition: {
      duration: 1.6,
      ease: easeOut,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: easeOut,
    },
  },
};

export default function ShopBanner({
  title,
  image,
  href,
  buttonText = "Explore Our Shop",
}: Props) {
  return (
    <motion.section
      className="relative w-full overflow-hidden h-80"
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
    >
      {/* Background Image */}
      <motion.div
        className="absolute inset-0"
        variants={imageReveal}
      >
        <Image
          src={image}
          alt={title}
          fill
          priority
          className="object-cover"
        />
      </motion.div>

      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-black/40"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: easeOut }}
        viewport={{ once: true }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <motion.h2
          className="mb-6 text-6xl tracking-wide text-background font-highlight"
          variants={fadeUp}
        >
          {title}
        </motion.h2>

        <motion.div variants={fadeUp}>
          <Link
            href={href}
            className="inline-flex items-center gap-3 px-6 py-3 text-sm font-normal transition border border-background text-background hover:bg-background hover:text-brand-primary"
          >
            {buttonText}
            <MoveRight className="w-5 h-5 stroke-[1.5]" />
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
