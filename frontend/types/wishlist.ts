// lib/wishlist.ts
import api from "@/lib/axios";

export const getWishlistAPI = async () => {
  const { data } = await api.get("/wishlist");
  return data.wishlist;
};

export const toggleWishlistAPI = async (productId: string) => {
  const { data } = await api.post("/wishlist/toggle", { productId });
  return data;
};
