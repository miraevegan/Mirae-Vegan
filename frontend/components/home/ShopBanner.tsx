"use client";

import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";

type Props = {
  title: string;
  image: string;
  href: string;
  buttonText?: string;
};

export default function ShopBanner({
  title,
  image,
  href,
  buttonText = "Explore Our Shop",
}: Props) {
  return (
    <section className="relative w-full overflow-hidden h-80">
      {/* Background Image */}
      <Image
        src={image}
        alt={title}
        fill
        priority
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <h2 className="mb-6 text-6xl tracking-wide text-background font-highlight">
          {title}
        </h2>

        <Link
          href={href}
          className="inline-flex items-center gap-3 px-6 py-3 text-sm font-normal transition border border-background text-background hover:bg-background hover:text-brand-primary"
        >
          {buttonText}
          <MoveRight className="w-5 h-5 stroke-[1.5]" />
        </Link>
      </div>
    </section>
  );
}
