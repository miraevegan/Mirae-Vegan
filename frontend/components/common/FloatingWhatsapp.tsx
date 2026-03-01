"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

export default function FloatingWhatsapp() {
    const pathname = usePathname();
    const [hide, setHide] = useState(false);

    // Only show on homepage
    const isHome = pathname === "/";

    useEffect(() => {
        if (!isHome) return;

        const footer = document.querySelector("footer");
        if (!footer) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setHide(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        observer.observe(footer);

        return () => observer.disconnect();
    }, [isHome]);

    if (!isHome) return null;

    return (
        <Link
            href="https://wa.me/919360696158"
            target="_blank"
            rel="noopener noreferrer"
            className={`
        fixed bottom-6 right-6 z-50
        transition-all duration-300
        ${hide ? "opacity-0 pointer-events-none translate-y-4" : "opacity-100"}
      `}
        >
            <div className="flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-xl hover:scale-105 transition-transform">
                <FaWhatsapp className="w-7 h-7 text-white" />
            </div>
        </Link>
    );
}