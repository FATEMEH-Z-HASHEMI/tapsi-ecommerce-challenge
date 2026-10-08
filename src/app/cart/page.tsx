import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Shopping cart",
  description: "Review products, variants, quantities, and subtotal in your Tapsi Store cart.",
};

export default function CartPage() {
  return (
    <div className="safe-inline mx-auto max-w-7xl py-8 sm:py-10">
      <div className="mb-7">
        <p className="type-label-sm text-content-tertiary">Shopping flow</p>
        <h1 className="mt-1 type-display-sm">Your cart</h1>
      </div>
      <CartView />
    </div>
  );
}
