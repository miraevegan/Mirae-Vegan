"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export default function AppLoader({
  loading,
  progress = 0,
}: {
  loading: boolean;
  progress?: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-9999 bg-surface/95 backdrop-blur-md flex items-center justify-center"
        >
          <motion.div
            initial={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 0, y: 12, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.985 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center gap-6 w-64"
          >
            {/* Brand */}
            <span className="font-brand text-8xl font-medium text-brand-primary tracking-wide">
              Miraé
            </span>

            {/* Luxury progress line */}
            <div className="relative w-full h-px bg-border/40 overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full bg-text-primary"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.6 }}
              />
            </div>

            {/* Subtext */}
            <motion.span
              initial={{ opacity: 0.35 }}
              animate={{ opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="text-xs tracking-[0.35em] uppercase text-brand-primary"
            >
              Conscious & Timeless
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
