import type { CartItem, CartState, Product, VariantSelections } from "../types/domain.js";

export function makeLineId(productId: string, variantId?: string): string {
  return `${productId}:${variantId ?? "base"}`;
}

export function getLineStock(product: Product, variantId?: string): number {
  if (variantId && product.variants?.length) {
    return product.variants.find((variant) => variant.id === variantId)?.stock ?? 0;
  }
  return product.stock;
}

export function addCartItem(
  state: CartState,
  product: Product,
  variantId: string | undefined,
  selections: VariantSelections,
  quantity = 1,
): CartState {
  const maxStock = getLineStock(product, variantId);
  if (maxStock <= 0 || quantity <= 0) return state;

  const lineId = makeLineId(product.id, variantId);
  const existing = state.items.find((item) => item.lineId === lineId);

  if (existing) {
    const nextQuantity = Math.min(existing.quantity + quantity, maxStock);
    return {
      items: state.items.map((item) =>
        item.lineId === lineId ? { ...item, quantity: nextQuantity } : item,
      ),
    };
  }

  return {
    items: [
      ...state.items,
      {
        lineId,
        productId: product.id,
        variantId,
        selections,
        quantity: Math.min(quantity, maxStock),
      },
    ],
  };
}

export function setCartItemQuantity(
  state: CartState,
  lineId: string,
  quantity: number,
  maxStock: number,
): CartState {
  if (quantity < 1) return state;
  const bounded = Math.min(quantity, Math.max(maxStock, 1));

  return {
    items: state.items.map((item) =>
      item.lineId === lineId ? { ...item, quantity: bounded } : item,
    ),
  };
}

export function removeCartItem(state: CartState, lineId: string): CartState {
  return { items: state.items.filter((item) => item.lineId !== lineId) };
}

export function cartTotalQuantity(items: readonly CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function cartSubtotalCents(
  items: readonly CartItem[],
  productsById: ReadonlyMap<string, Product>,
): number {
  return items.reduce((total, item) => {
    const product = productsById.get(item.productId);
    return total + (product ? product.priceCents * item.quantity : 0);
  }, 0);
}

export function sanitizeCartState(
  value: unknown,
  productsById: ReadonlyMap<string, Product>,
): CartState {
  if (!value || typeof value !== "object" || !("items" in value) || !Array.isArray(value.items)) {
    return { items: [] };
  }

  const items: CartItem[] = [];
  for (const raw of value.items) {
    if (!raw || typeof raw !== "object") continue;
    const candidate = raw as Partial<CartItem>;
    if (
      typeof candidate.productId !== "string" ||
      typeof candidate.lineId !== "string" ||
      typeof candidate.quantity !== "number" ||
      !Number.isInteger(candidate.quantity) ||
      candidate.quantity < 1
    ) {
      continue;
    }

    const product = productsById.get(candidate.productId);
    if (!product) continue;

    const maxStock = getLineStock(product, candidate.variantId);
    if (maxStock <= 0) continue;

    const expectedLineId = makeLineId(product.id, candidate.variantId);
    if (candidate.lineId !== expectedLineId) continue;

    const selections =
      candidate.selections && typeof candidate.selections === "object" && !Array.isArray(candidate.selections)
        ? candidate.selections
        : {};

    items.push({
      lineId: candidate.lineId,
      productId: product.id,
      variantId: candidate.variantId,
      selections,
      quantity: Math.min(candidate.quantity, maxStock),
    });
  }

  return { items };
}
