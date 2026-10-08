export type ProductCategory = "Apparel" | "Footwear" | "Accessories" | "Electronics" | "Home";
export type ProductOptionName = "color" | "size";

export interface ProductImage {
  src: string;
  alt: string;
}

export interface ProductOption {
  name: ProductOptionName;
  label: string;
  values: string[];
}

export type VariantSelections = Partial<Record<ProductOptionName, string>>;

export interface ProductVariant {
  id: string;
  selections: VariantSelections;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ProductCategory;
  priceCents: number;
  originalPriceCents?: number;
  images: ProductImage[];
  stock: number;
  options?: ProductOption[];
  variants?: ProductVariant[];
}

export interface ProductFilterState {
  categories: ProductCategory[];
  minPriceCents?: number;
  maxPriceCents?: number;
  inStockOnly: boolean;
}

export interface CartItem {
  lineId: string;
  productId: string;
  variantId?: string;
  selections: VariantSelections;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}
