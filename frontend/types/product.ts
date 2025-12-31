export interface ProductImage {
  url: string;
  public_id: string;
}

export interface VariantAttribute {
  color?: {
    name: string;
    hex: string;
  };
  size?: string;
}

export interface Variant {
  _id: string;           // Mongo ObjectId string
  attributes: VariantAttribute;
  price: number;
  stock: number;
  images?: ProductImage[];
  sku?: string;
}

export interface Discount {
  percentage: number;
}

export interface Specifications {
  material?: string;
  care?: string;
  origin?: string;
  weight?: string;
  warranty?: string;
}

export interface ProductAttributes {
  [key: string]: unknown; // flexible for arbitrary product-level attributes
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  
  images: ProductImage[];
  variants?: Variant[];  // Array of variants for this product
  
  discount: Discount;

  attribute?: ProductAttributes;

  specification?: Specifications;

  ratings: number;
  numOfReviews: number;

  isBestSeller?: boolean;
  isJustLanded?: boolean;
}
