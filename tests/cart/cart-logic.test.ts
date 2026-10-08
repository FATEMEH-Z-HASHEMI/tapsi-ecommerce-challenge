import { describe, expect, it } from "vitest";
import {
  addCartItem,
  cartSubtotalCents,
  cartTotalQuantity,
  removeCartItem,
  setCartItemQuantity,
} from "@/lib/cart";
import type { Product } from "@/types/domain";

const product: Product = {
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

describe("cart logic", () => {
  it("adds a new item and merges the same variant", () => {
    let state = addCartItem({ items: [] }, product, "white-40", { color: "White", size: "40" });
    state = addCartItem(state, product, "white-40", { color: "White", size: "40" });
    expect(state.items).toHaveLength(1);
    expect(state.items[0]?.quantity).toBe(2);
  });

  it("keeps a different variant on a different line", () => {
    let state = addCartItem({ items: [] }, product, "white-40", { color: "White", size: "40" });
    state = addCartItem(state, product, "black-40", { color: "Black", size: "40" });
    expect(state.items).toHaveLength(2);
  });

  it("enforces stock limits while updating quantity", () => {
    let state = addCartItem({ items: [] }, product, "white-40", { color: "White", size: "40" });
    state = setCartItemQuantity(state, state.items[0]!.lineId, 99, 3);
    expect(state.items[0]?.quantity).toBe(3);
  });

  it("calculates subtotal and total quantity from current state", () => {
    const state = addCartItem({ items: [] }, product, "white-40", { color: "White", size: "40" }, 2);
    expect(cartTotalQuantity(state.items)).toBe(2);
    expect(cartSubtotalCents(state.items, new Map([[product.id, product]]))).toBe(24000);
  });

  it("removes an item explicitly", () => {
    let state = addCartItem({ items: [] }, product, "white-40", { color: "White", size: "40" });
    state = removeCartItem(state, state.items[0]!.lineId);
    expect(state.items).toEqual([]);
  });
});
