import type { Metadata } from "next";
import Link from "next/link";
import { buttonClassName } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Demo checkout",
  description: "Front-end demonstration checkout for the Tapsi Store challenge.",
};

export default function CheckoutPage() {
  return (
    <div className="safe-inline mx-auto max-w-3xl py-12 sm:py-16">
      <section className="rounded-t6 border border-border-primary bg-surface-primary p-6 sm:p-10">
        <p className="type-label-sm text-[var(--tapsi-palette-orange-600)]">Demo checkout</p>
        <h1 className="mt-2 type-display-sm">Checkout stops here — by design.</h1>
        <p className="mt-4 text-content-secondary">
          This coding challenge is intentionally front-end only. No payment provider, customer account, backend order creation, or real transaction is connected, so this page does not pretend to process a purchase.
        </p>
        <div className="mt-6 rounded-t4 bg-surface-secondary p-4 type-body-sm text-content-secondary">
          In a production application, this route would collect delivery details and hand off to a secure server-side checkout flow.
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/cart" className={buttonClassName("primary")}>Back to cart</Link>
          <Link href="/" className={buttonClassName("ghost")}>Continue shopping</Link>
        </div>
      </section>
    </div>
  );
}
