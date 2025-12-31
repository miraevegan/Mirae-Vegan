"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

export type CartItem = {
  productId: string;
  variantId: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  quantity: number;
  stock?: number;
};

type CartContextType = {
  cart: CartItem[];
  loading: boolean;
  addToCart: (
    productId: string,
    quantity?: number,
    variantId?: string,
    variantAttributes?: Record<string, string>
  ) => Promise<void>;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => Promise<void>;
  removeFromCart: (productId: string, variantId?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get("/cart");
      setCart(res.data); // ✅ FIX
    } catch {
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addToCart = useCallback(
    async (productId: string, quantity = 1, variantId?: string) => {
      if (!user) throw new Error("User not authenticated");
      if (!variantId) throw new Error("Variant is required");

      setLoading(true);
      try {
        const res = await api.post("/cart/add", {
          productId,
          variantId,
          quantity,
        });

        setCart(res.data); // backend returns array
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number, variantId?: string) => {
      if (!variantId) return;

      setLoading(true);
      try {
        const res = await api.put("/cart/update", {
          productId,
          variantId,
          quantity,
        });

        setCart(res.data);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const removeFromCart = useCallback(
    async (productId: string, variantId?: string) => {
      if (!variantId) return;

      setLoading(true);
      try {
        const res = await api.delete(
          `/cart/remove/${productId}/${variantId}`
        );
        setCart(res.data);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearCart = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      await api.delete("/cart/clear");
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch cart on user change (login/logout)
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [fetchCart, user]);

  // Restore pending cart item after login
  useEffect(() => {
    if (!user) return;

    const pending = localStorage.getItem("pendingCartItem");
    if (!pending) return;

    try {
      const { productId, quantity, variantId } = JSON.parse(pending);
      addToCart(productId, quantity, variantId);
      localStorage.removeItem("pendingCartItem");
    } catch (err) {
      console.error("Failed to restore pending cart item", err);
    }
  }, [addToCart, user]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
