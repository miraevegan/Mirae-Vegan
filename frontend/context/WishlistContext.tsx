"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Product, Variant } from "@/types/product";
import { useAuth } from "./AuthContext";
import api from "@/lib/axios";

type WishlistItem = {
    product: Product;
    variant: Variant;
};

interface WishlistContextType {
    wishlist: WishlistItem[];
    isWishlisted: (productId: string, variantId: string) => boolean;
    toggleWishlist: (product: Product, variant: Variant) => Promise<void>;
    refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

    const fetchWishlist = useCallback(async () => {
        if (!user) {
            setWishlist([]);
            return;
        }
        try {
            const res = await api.get("/wishlist");
            if (res.data.success) {
                setWishlist(res.data.wishlist);
            }
        } catch (err) {
            console.error("Failed to fetch wishlist", err);
        }
    }, [user]);

    useEffect(() => {
        let isMounted = true;

        async function loadWishlist() {
            if (!user) {
                if (isMounted) setWishlist([]);
                return;
            }
            try {
                const res = await api.get("/wishlist");
                if (res.data.success && isMounted) {
                    setWishlist(res.data.wishlist);
                }
            } catch (err) {
                console.error("Failed to fetch wishlist", err);
            }
        }

        loadWishlist();

        return () => {
            isMounted = false;
        };
    }, [user]);

    const isWishlisted = (productId: string, variantId: string) => {
        return wishlist.some(
            (item) => item.product._id === productId && item.variant._id === variantId
        );
    };

    const toggleWishlist = async (product: Product, variant: Variant) => {
        if (!user) return;

        try {
            const res = await api.post("/wishlist/toggle", {
                productId: product._id,
                variantId: variant._id,
            });

            if (res.data.success) {
                await fetchWishlist();
            }
        } catch (err) {
            console.error("Toggle wishlist failed", err);
        }
    };

    return (
        <WishlistContext.Provider
            value={{ wishlist, isWishlisted, toggleWishlist, refreshWishlist: fetchWishlist }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error("useWishlist must be used within WishlistProvider");
    }
    return context;
};
