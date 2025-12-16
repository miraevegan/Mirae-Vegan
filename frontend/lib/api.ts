import api from "./axios";

export async function getJustLandedProducts() {
  try {
    const response = await api.get("/products/just-landed");
    return response.data.products;
  } catch (error) {
    console.error("Failed to fetch just landed products", error);
    throw error;
  }
}
