import test from "node:test";
import assert from "node:assert/strict";
import { isOptionValueAvailable, resolveVariant } from "../.domain-build/lib/variants.js";

const product = {
  id: "shoe",
  slug: "shoe",
  name: "Shoe",
  description: "",
  category: "Footwear",
  priceCents: 100,
  images: [],
  stock: 0,
  options: [
    { name: "color", label: "Color", values: ["White", "Black"] },
    { name: "size", label: "Size", values: ["40", "41"] },
  ],
  variants: [
    { id: "white-40", selections: { color: "White", size: "40" }, stock: 2 },
    { id: "white-41", selections: { color: "White", size: "41" }, stock: 0 },
    { id: "black-41", selections: { color: "Black", size: "41" }, stock: 1 },
  ],
};

test("resolves only complete exact variants", () => {
  assert.equal(resolveVariant(product, { color: "White" }), undefined);
  assert.equal(resolveVariant(product, { color: "White", size: "40" })?.id, "white-40");
});

test("disables impossible or out-of-stock combinations", () => {
  assert.equal(isOptionValueAvailable(product, "size", "41", { color: "White" }), false);
  assert.equal(isOptionValueAvailable(product, "size", "41", { color: "Black" }), true);
});
