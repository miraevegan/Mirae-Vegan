"use client";

import { useEffect, useState } from "react";
import { MoveRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import axios from "@/lib/axios";

type HeroMedia = {
  url: string;
};

export default function HeroSection() {
  const [media, setMedia] = useState<HeroMedia[]>([]);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [index, setIndex] = useState(0);

  /* Fetch hero */
  useEffect(() => {
    const fetchHero = async () => {
      const res = await axios.get("/hero");
      if (res.data) {
        setMedia(res.data.media);
        setMediaType(res.data.mediaType);
      }
    };
    fetchHero();
  }, []);

  /* Auto rotate (luxury timing) */
  useEffect(() => {
    if (media.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % media.length);
    }, 7000); // 7s feels premium

    return () => clearInterval(timer);
  }, [media]);

  return (
    <section className="relative w-full min-h-[80vh] sm:min-h-[90vh] overflow-hidden">
      {/* MEDIA CAROUSEL */}
      <AnimatePresence mode="wait">
        {media.length > 0 && (
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
          >
            {mediaType === "video" ? (
              <video
                src={media[index].url}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${media[index].url})`,
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SOFT OVERLAY */}
      <div className="absolute inset-0 bg-black/25" />

      {/* CONTENT */}
      <div className="relative z-10 flex items-center justify-center min-h-[80vh] sm:min-h-[90vh] px-4">
        <motion.div
          className="max-w-5xl text-center"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.2 } },
          }}
        >
          {/* BRAND */}
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 28 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 1.4, ease: "easeOut" },
              },
            }}
            className="
              font-light font-brand text-background leading-none
              text-[72px] sm:text-[96px] md:text-[120px] lg:text-[140px]
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
                transition: { duration: 1.2, ease: "easeOut" },
              },
            }}
            className="
              font-extralight text-background mt-2 mb-20
              text-lg sm:text-xl md:text-2xl
            "
          >
            Conscious & Timeless
          </motion.p>

          {/* CTA */}
          <Link href="#just-landed">
            <motion.button
              whileHover={{ y: -2, scale: 1.04 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="
                inline-flex items-center gap-3
                px-6 py-3
                tracking-widest text-xs sm:text-sm
                border border-background text-background
                hover:bg-background hover:text-brand-primary
              "
            >
              <MoveRight className="w-5 h-5 stroke-[1.4]" />
              NEW ARRIVALS IN STORE
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
