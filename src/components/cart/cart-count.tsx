"use client";

import { useCart } from "@/components/cart/cart-provider";

export function CartCount() {
  const { totalQuantity, hydrated } = useCart();

  if (!hydrated || totalQuantity === 0) return null;

  return (
    <span className="absolute -right-2 -top-2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-pill bg-brand px-1 text-[11px] font-semibold leading-5 text-on-brand" aria-label={`${totalQuantity} items in cart`}>
      {totalQuantity > 99 ? "99+" : totalQuantity}
    </span>
  );
}
