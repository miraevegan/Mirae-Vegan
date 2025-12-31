"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { useWishlist } from "@/context/WishlistContext";
import type { Variant } from "@/types/product";
import Link from "next/link";

interface WishlistDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
    const { wishlist, toggleWishlist } = useWishlist();

    /* ---------- ESC key + scroll lock ---------- */
    useEffect(() => {
        if (!isOpen) return;

        document.body.style.overflow = "hidden";

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleEsc);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleEsc);
        };
    }, [isOpen, onClose]);

    function variantDisplayName(variant: Variant): string {
        const { attributes } = variant;
        const parts: string[] = [];

        if (attributes.color?.name) {
            parts.push(attributes.color.name);
        }

        if (attributes.size) {
            parts.push(attributes.size);
        }

        return parts.length > 0 ? parts.join(" / ") : variant._id;
    }

    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                className={`
          fixed inset-0 z-40 bg-black/40 backdrop-blur-sm
          transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
            />

            {/* Drawer */}
            <aside
                className={`
          fixed top-0 right-0 z-50 h-full w-full sm:w-105 bg-background
          transform transition-transform duration-300 ease-out
          flex flex-col
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
                aria-hidden={!isOpen}
            >
                {/* Header */}
                <header className="flex items-center justify-between px-6 py-5 border-b border-black/10 sticky top-0 bg-background z-10">
                    <h2 className="text-lg font-semibold tracking-wide text-brand-primary">
                        Wishlist ({wishlist.length})
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label="Close wishlist"
                        className="text-2xl leading-none transition text-black/70 hover:text-black"
                    >
                        ×
                    </button>
                </header>

                {/* Content */}
                <div className="flex-1 px-6 py-4 space-y-5 overflow-y-auto">
                    {wishlist.length === 0 ? (
                        <p className="text-center text-black/50 mt-20">Your wishlist is empty.</p>
                    ) : (
                        <ul className="flex flex-col gap-4">
                            {wishlist.map(({ product, variant }) => (
                                <li
                                    key={`${product._id}-${variant._id}`}
                                    className="flex gap-4 items-center"
                                >
                                    <Link
                                        href={`/products/${product.slug}`}
                                        className="flex gap-4 items-center grow cursor-pointer"
                                        onClick={() => onClose()} // optionally close drawer on click
                                    >
                                        <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
                                            <Image
                                                src={product.images?.[0]?.url || "/images/placeholder-product.jpg"}
                                                alt={product.name}
                                                fill
                                                sizes="64px"
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{product.name}</p>
                                            <p className="text-sm text-gray-600">
                                                Variant: {variantDisplayName(variant)}
                                            </p>
                                        </div>
                                    </Link>

                                    <button
                                        className="text-red-500 hover:text-red-700 text-lg"
                                        onClick={() => toggleWishlist(product, variant)}
                                        aria-label={`Remove ${product.name} (${variantDisplayName(variant)}) from wishlist`}
                                    >
                                        &times;
                                    </button>
                                </li>
                            ))}

                        </ul>
                    )}
                </div>

                {/* Footer */}
                <footer className="px-6 py-6 border-t border-black/10">
                    <button
                        onClick={onClose}
                        className="w-full py-3 text-sm font-semibold tracking-wide bg-brand-primary text-background hover:bg-brand-primary/90 transition"
                    >
                        Continue Shopping
                    </button>
                </footer>
            </aside>
        </>
    );
}
