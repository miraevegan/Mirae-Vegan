"use client";

import FeatureItem from "../extras/FeatureItem";
import {
  Truck,
  ShieldCheck,
  Package,
  RefreshCcw,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";

/* ---------------------------
   Motion variants
---------------------------- */

const easeOut = [0.16, 1, 0.3, 1] as const;

const sectionFade: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: easeOut,
    },
  },
};

const gridContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const gridItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: easeOut,
    },
  },
};

/* ---------------------------
   Data
---------------------------- */

const FEATURES = [
  {
    icon: Truck,
    title: "Fast Delivery",
    subtitle: "Get Your Order Within 10-15 Days",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    subtitle: "100% Secure Payment Gateways",
  },
  {
    icon: Package,
    title: "Premium Quality",
    subtitle: "Crafted With High Quality Materials",
  },
  {
    icon: RefreshCcw,
    title: "Easy Returns",
    subtitle: "Hassle-free Returns Within 7 Days",
  },
];

export default function FeaturesSection() {
  return (
    <motion.section
      className="px-6 py-16 mx-auto sm:px-10 sm:py-20"
      variants={sectionFade}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
    >
      <motion.div
        className="grid grid-cols-1 gap-10 text-center sm:grid-cols-2 lg:grid-cols-4 sm:text-left"
        variants={gridContainer}
      >
        {FEATURES.map((feature) => (
          <motion.div
            key={feature.title}
            variants={gridItem}
            className="flex justify-center sm:block"
          >
            <FeatureItem
              icon={feature.icon}
              title={feature.title}
              subtitle={feature.subtitle}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
