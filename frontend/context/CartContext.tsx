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
  name: string;
  image: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  loading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
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
      setCart(res.data.cart || []);
    } catch {
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addToCart = useCallback(
    async (productId: string, quantity = 1) => {
      if (!user) throw new Error("User not authenticated");
      setLoading(true);
      try {
        const res = await api.post("/cart", { productId, quantity });
        setCart(res.data.cart);
      } catch (error) {
        console.error("Failed to add to cart", error);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    setLoading(true);
    try {
      const res = await api.put(`/cart/${productId}`, { quantity });
      setCart(res.data.cart);
    } catch (error) {
      console.error("Failed to update quantity", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFromCart = useCallback(async (productId: string) => {
    setLoading(true);
    try {
      const res = await api.delete(`/cart/${productId}`);
      setCart(res.data.cart);
    } catch (error) {
      console.error("Failed to remove from cart", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCart = useCallback(async () => {
    setCart([]);
    if (!user) return;
    await api.delete("/cart");
  }, [user]);

  // Fetch cart on login/logout
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
      const { productId, quantity } = JSON.parse(pending);
      addToCart(productId, quantity);
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
