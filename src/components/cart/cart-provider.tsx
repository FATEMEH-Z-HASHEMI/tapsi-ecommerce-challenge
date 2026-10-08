"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { productsById } from "@/data/products";
import {
  addCartItem,
  cartSubtotalCents,
  cartTotalQuantity,
  getLineStock,
  removeCartItem,
  sanitizeCartState,
  setCartItemQuantity,
} from "@/lib/cart";
import type { CartItem, CartState, Product, VariantSelections } from "@/types/domain";

const STORAGE_KEY = "tapsi-store-cart-v1";

type CartContextValue = {
  items: CartItem[];
  hydrated: boolean;
  totalQuantity: number;
  subtotalCents: number;
  addItem: (product: Product, variantId?: string, selections?: VariantSelections) => boolean;
  setQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>({ items: [] });
  const [hydrated, setHydrated] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState(sanitizeCartState(JSON.parse(raw), productsById));
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const addItem = (product: Product, variantId?: string, selections: VariantSelections = {}) => {
      const maxStock = getLineStock(product, variantId);
      if (maxStock <= 0) {
        setAnnouncement(`${product.name} is out of stock.`);
        return false;
      }

      const lineId = `${product.id}:${variantId ?? "base"}`;
      const existing = state.items.find((item) => item.lineId === lineId);
      if (existing && existing.quantity >= maxStock) {
        setAnnouncement(`Maximum available quantity for ${product.name} is already in your cart.`);
        return false;
      }

      setState((current) => addCartItem(current, product, variantId, selections));
      setAnnouncement(`${product.name} added to cart.`);
      return true;
    };

    const setQuantity = (lineId: string, quantity: number) => {
      setState((current) => {
        const line = current.items.find((item) => item.lineId === lineId);
        if (!line) return current;
        const product = productsById.get(line.productId);
        if (!product) return current;
        const maxStock = getLineStock(product, line.variantId);
        return setCartItemQuantity(current, lineId, quantity, maxStock);
      });
    };

    const removeItem = (lineId: string) => {
      setState((current) => removeCartItem(current, lineId));
      setAnnouncement("Item removed from cart.");
    };

    const clearCart = () => {
      setState({ items: [] });
      setAnnouncement("Cart cleared.");
    };

    return {
      items: state.items,
      hydrated,
      totalQuantity: cartTotalQuantity(state.items),
      subtotalCents: cartSubtotalCents(state.items, productsById),
      addItem,
      setQuantity,
      removeItem,
      clearCart,
    };
  }, [state, hydrated]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
