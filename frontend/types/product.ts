export interface ProductImage {
  url: string;
  public_id: string;
}

/* ---------------- Variant ---------------- */

export interface VariantAttribute {
  color?: {
    name: string;
    hex: string;
  };
  size?: string;
}

export interface Variant {
  _id: string;
  attributes: VariantAttribute;
  price: number;
  stock: number;
  images?: ProductImage[];
  sku?: string;
}

/* ---------------- Discount ---------------- */

export interface Discount {
  percentage: number;
}

/* ---------------- Product Attributes ---------------- */

export interface ProductAttributes {
  material?: string;
  fit?: string;
}

/* ---------------- Specifications ---------------- */

export interface Specifications {
  care?: string;
  origin?: string;
  weight?: string;
  warranty?: string;
}

/* ---------------- Product ---------------- */

export interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string;
  description: string;

  images: ProductImage[];

  variants?: Variant[];

  discount: Discount;

  attributes?: ProductAttributes;

  specifications?: Specifications;

  ratings: number;
  numOfReviews: number;

  isBestSeller?: boolean;
  isJustLanded?: boolean;
  isVegan?: boolean;
}