import { describe, expect, it } from "vitest";
import { filterProducts, validatePriceRange } from "@/lib/catalog";
import type { Product } from "@/types/domain";

const fixtures: Product[] = [
  { id: "a", slug: "a", name: "A", description: "", category: "Apparel", priceCents: 5000, images: [], stock: 2 },
  { id: "b", slug: "b", name: "B", description: "", category: "Home", priceCents: 10000, images: [], stock: 0 },
  { id: "c", slug: "c", name: "C", description: "", category: "Apparel", priceCents: 15000, images: [], stock: 0, variants: [{ id: "c-m", selections: { size: "M" }, stock: 2 }] },
];

describe("filterProducts", () => {
  it("filters by category", () => {
    expect(filterProducts(fixtures, { categories: ["Apparel"], inStockOnly: false }).map((p) => p.id)).toEqual(["a", "c"]);
  });

  it("filters by price", () => {
    expect(filterProducts(fixtures, { categories: [], minPriceCents: 6000, maxPriceCents: 12000, inStockOnly: false }).map((p) => p.id)).toEqual(["b"]);
  });

  it("filters by stock and combines filters", () => {
    expect(filterProducts(fixtures, { categories: ["Apparel"], minPriceCents: 10000, inStockOnly: true }).map((p) => p.id)).toEqual(["c"]);
  });

  it("returns an empty result when nothing matches", () => {
    expect(filterProducts(fixtures, { categories: ["Footwear"], inStockOnly: false })).toEqual([]);
  });

  it("does not mutate source data", () => {
    const before = structuredClone(fixtures);
    filterProducts(fixtures, { categories: ["Home"], inStockOnly: false });
    expect(fixtures).toEqual(before);
  });

  it("validates inverted price ranges", () => {
    expect(validatePriceRange(12000, 5000)).toMatch(/Minimum price/);
  });
});
