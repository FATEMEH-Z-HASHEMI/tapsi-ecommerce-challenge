"use client";

import Image from "next/image";
import Link from "next/link";
import { AddCircleIcon, MinusCircleIcon, TrashBin2Icon } from "@solar-icons/react/linear";
import { useCart } from "@/components/cart/cart-provider";
import { Button, buttonClassName } from "@/components/ui/button";
import { productsById } from "@/data/products";
import { formatCurrency } from "@/lib/currency";
import { getLineStock } from "@/lib/cart";
import { variantSelectionsLabel } from "@/lib/variants";

export function CartView() {
  const { items, hydrated, totalQuantity, subtotalCents, setQuantity, removeItem, clearCart } = useCart();

  if (!hydrated) {
    return (
      <div className="space-y-4" aria-label="Loading cart">
        <div className="h-32 animate-pulse rounded-t5 bg-surface-tertiary" />
        <div className="h-32 animate-pulse rounded-t5 bg-surface-tertiary" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-t6 border border-border-primary bg-surface-primary p-8 text-center sm:p-12">
        <h2 className="type-headline-md">Your cart is empty</h2>
        <p className="mx-auto mt-2 max-w-md text-content-secondary">Browse the catalog and add an available product or variant to start your order.</p>
        <Link href="/" className={buttonClassName("brand", "mt-6")}>Browse products</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_21rem]">
      <section aria-label="Cart items" className="space-y-4">
        {items.map((item) => {
          const product = productsById.get(item.productId);
          if (!product) return null;
          const maxStock = getLineStock(product, item.variantId);
          return (
            <article key={item.lineId} className="grid grid-cols-[6rem_minmax(0,1fr)] gap-4 rounded-t5 border border-border-primary bg-surface-primary p-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
              <Link href={`/products/${product.slug}`} className="focus-ring relative aspect-square overflow-hidden rounded-t3 bg-surface-secondary">
                <Image src={product.images[0]?.src ?? "/products/fallback.svg"} alt={product.images[0]?.alt ?? product.name} fill sizes="128px" className="object-contain" />
              </Link>
              <div className="min-w-0">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                  <div>
                    <h2 className="type-headline-sm"><Link href={`/products/${product.slug}`} className="focus-ring rounded-t2 hover:underline">{product.name}</Link></h2>
                    {Object.keys(item.selections).length ? <p className="mt-1 type-body-sm text-content-secondary">{variantSelectionsLabel(item.selections)}</p> : null}
                    <p className="mt-1 type-label-sm">{formatCurrency(product.priceCents)} each</p>
                  </div>
                  <button type="button" onClick={() => removeItem(item.lineId)} className="focus-ring inline-flex min-h-10 items-center gap-2 self-start rounded-t3 px-2 type-label-sm text-content-negative hover:bg-surface-negative-light" aria-label={`Remove ${product.name} from cart`}>
                    <TrashBin2Icon size={18} aria-hidden="true" />
                    <span className="sm:hidden">Remove</span>
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center rounded-t3 border border-border-primary" aria-label={`Quantity for ${product.name}`}>
                    <button type="button" onClick={() => setQuantity(item.lineId, item.quantity - 1)} disabled={item.quantity <= 1} className="focus-ring grid size-11 place-items-center rounded-l-t3 text-content-primary hover:bg-surface-secondary disabled:text-content-disabled" aria-label={`Decrease ${product.name} quantity`}>
                      <MinusCircleIcon size={19} aria-hidden="true" />
                    </button>
                    <span className="min-w-10 text-center type-label-sm" aria-live="polite">{item.quantity}</span>
                    <button type="button" onClick={() => setQuantity(item.lineId, item.quantity + 1)} disabled={item.quantity >= maxStock} className="focus-ring grid size-11 place-items-center rounded-r-t3 text-content-primary hover:bg-surface-secondary disabled:text-content-disabled" aria-label={`Increase ${product.name} quantity`}>
                      <AddCircleIcon size={19} aria-hidden="true" />
                    </button>
                  </div>
                  <p className="type-label-md">{formatCurrency(product.priceCents * item.quantity)}</p>
                </div>
                {item.quantity >= maxStock ? <p className="mt-2 type-body-sm text-content-tertiary">Maximum available quantity reached.</p> : null}
              </div>
            </article>
          );
        })}

        <Button variant="ghost" onClick={clearCart}>Clear cart</Button>
      </section>

      <aside className="h-fit rounded-t5 border border-border-primary bg-surface-primary p-5 lg:sticky lg:top-24" aria-label="Order summary">
        <h2 className="type-headline-sm">Order summary</h2>
        <dl className="mt-5 space-y-3">
          <div className="flex justify-between gap-4"><dt className="text-content-secondary">Items</dt><dd>{totalQuantity}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-content-secondary">Subtotal</dt><dd className="type-label-md">{formatCurrency(subtotalCents)}</dd></div>
        </dl>
        <p className="mt-4 border-t border-border-primary pt-4 type-body-sm text-content-secondary">Shipping, tax, and payment are intentionally not processed in this front-end-only challenge.</p>
        <Link href="/checkout" className={buttonClassName("brand", "mt-5 w-full")}>Continue to demo checkout</Link>
      </aside>
    </div>
  );
}
