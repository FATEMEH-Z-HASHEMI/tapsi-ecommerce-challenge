import test from "node:test";
import assert from "node:assert/strict";
import {
  addCartItem,
  cartSubtotalCents,
  cartTotalQuantity,
  makeLineId,
  removeCartItem,
  sanitizeCartState,
  setCartItemQuantity,
} from "../.domain-build/lib/cart.js";

const product = {
  id: "shoe",
  slug: "shoe",
  name: "Shoe",
  description: "",
  category: "Footwear",
  priceCents: 12000,
  images: [],
  stock: 0,
  variants: [
    { id: "white-40", selections: { color: "White", size: "40" }, stock: 3 },
    { id: "black-40", selections: { color: "Black", size: "40" }, stock: 2 },
  ],
};

const productMap = new Map([[product.id, product]]);

test("adds same variant to the same line and respects stock", () => {
  let state = { items: [] };
  state = addCartItem(state, product, "white-40", { color: "White", size: "40" });
  state = addCartItem(state, product, "white-40", { color: "White", size: "40" }, 5);
  assert.equal(state.items.length, 1);
  assert.equal(state.items[0].quantity, 3);
});

test("keeps different variants as distinct lines", () => {
  let state = { items: [] };
  state = addCartItem(state, product, "white-40", { color: "White", size: "40" });
  state = addCartItem(state, product, "black-40", { color: "Black", size: "40" });
  assert.equal(state.items.length, 2);
  assert.notEqual(state.items[0].lineId, state.items[1].lineId);
});

test("updates quantity, totals, subtotal, and removal", () => {
  let state = addCartItem({ items: [] }, product, "white-40", { color: "White", size: "40" });
  state = setCartItemQuantity(state, makeLineId("shoe", "white-40"), 2, 3);
  assert.equal(cartTotalQuantity(state.items), 2);
  assert.equal(cartSubtotalCents(state.items, productMap), 24000);
  state = removeCartItem(state, state.items[0].lineId);
  assert.equal(state.items.length, 0);
});

test("sanitizes malformed persisted cart data and caps quantity", () => {
  const sanitized = sanitizeCartState({ items: [
    { lineId: "bad", productId: "missing", quantity: 1, selections: {} },
    { lineId: "shoe:white-40", productId: "shoe", variantId: "white-40", quantity: 99, selections: { color: "White", size: "40" } },
  ] }, productMap);
  assert.equal(sanitized.items.length, 1);
  assert.equal(sanitized.items[0].quantity, 3);
});
