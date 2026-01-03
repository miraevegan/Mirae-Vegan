import api from "@/lib/axios";
import { Product, Variant } from "@/types/product";

function getMinVariantPrice(variants?: Variant[]): number {
  if (!variants || variants.length === 0) return 0;
  return Math.min(...variants.map((v) => Number(v.price) || 0));
}

function mapBackendProductToFrontend(product: Product) {
  const basePrice = getMinVariantPrice(product.variants);
  const discountPercentage = product.discount?.percentage || 0;
  const discountedPrice = Math.round(basePrice * (1 - discountPercentage / 100));

  return {
    _id: product._id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: basePrice,
    discountedPrice,
    discount: {
      percentage: discountPercentage,
      discountedPrice,
    },
    category: product.category,
    images: product.images || [],
    ratings: product.ratings || 0,
    numOfReviews: product.numOfReviews || 0,
    variants: product.variants || [],
    isBestSeller: product.isBestSeller || false,
    isJustLanded: product.isJustLanded || false,
    isVegan: product.isVegan || false,
  };
}

export async function getJustLandedProducts() {
  try {
    const response = await api.get("/products/just-landed");
    return response.data.map(mapBackendProductToFrontend);
  } catch (error) {
    console.error("Failed to fetch just landed products", error);
    throw error;
  }
}

export async function getBestSellerProducts() {
  try {
    const response = await api.get("/products/best-sellers");
    return response.data.map(mapBackendProductToFrontend);
  } catch (error) {
    console.error("Failed to fetch best selling products", error);
    throw error;
  }
}
