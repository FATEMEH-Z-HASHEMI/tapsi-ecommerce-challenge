import test from "node:test";
import assert from "node:assert/strict";
import { filterProducts, validatePriceRange } from "../.domain-build/lib/catalog.js";

const products = [
  { id: "a", slug: "a", name: "A", description: "", category: "Apparel", priceCents: 5000, images: [], stock: 3 },
  { id: "b", slug: "b", name: "B", description: "", category: "Home", priceCents: 10000, images: [], stock: 0 },
  { id: "c", slug: "c", name: "C", description: "", category: "Apparel", priceCents: 15000, images: [], stock: 0, variants: [{ id: "c-1", selections: { size: "M" }, stock: 2 }] },
];

test("filters by category without mutating source", () => {
  const before = structuredClone(products);
  const result = filterProducts(products, { categories: ["Apparel"], inStockOnly: false });
  assert.deepEqual(result.map((item) => item.id), ["a", "c"]);
  assert.deepEqual(products, before);
});

test("combines price and stock filters", () => {
  const result = filterProducts(products, { categories: [], minPriceCents: 6000, maxPriceCents: 16000, inStockOnly: true });
  assert.deepEqual(result.map((item) => item.id), ["c"]);
});

test("returns empty results when nothing matches", () => {
  const result = filterProducts(products, { categories: ["Footwear"], inStockOnly: false });
  assert.equal(result.length, 0);
});

test("validates inverted price ranges", () => {
  assert.equal(validatePriceRange(10000, 5000), "Minimum price cannot be greater than maximum price.");
  assert.equal(validatePriceRange(5000, 10000), null);
});
