import type { Product, ProductFilterState } from "../types/domain.js";

export function getProductStock(product: Product): number {
  if (product.variants?.length) {
    return product.variants.reduce((total, variant) => total + Math.max(variant.stock, 0), 0);
  }
  return Math.max(product.stock, 0);
}

export function isProductInStock(product: Product): boolean {
  return getProductStock(product) > 0;
}

export function filterProducts(products: readonly Product[], filters: ProductFilterState): Product[] {
  return products.filter((product) => {
    const categoryMatches =
      filters.categories.length === 0 || filters.categories.includes(product.category);
    const minMatches =
      filters.minPriceCents === undefined || product.priceCents >= filters.minPriceCents;
    const maxMatches =
      filters.maxPriceCents === undefined || product.priceCents <= filters.maxPriceCents;
    const stockMatches = !filters.inStockOnly || isProductInStock(product);

    return categoryMatches && minMatches && maxMatches && stockMatches;
  });
}

export function hasActiveFilters(filters: ProductFilterState): boolean {
  return (
    filters.categories.length > 0 ||
    filters.minPriceCents !== undefined ||
    filters.maxPriceCents !== undefined ||
    filters.inStockOnly
  );
}

export function validatePriceRange(min?: number, max?: number): string | null {
  if (min !== undefined && min < 0) return "Minimum price cannot be negative.";
  if (max !== undefined && max < 0) return "Maximum price cannot be negative.";
  if (min !== undefined && max !== undefined && min > max) {
    return "Minimum price cannot be greater than maximum price.";
  }
  return null;
}
