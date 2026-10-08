import Link from "next/link";
import { CartLarge2Icon, HomeIcon } from "@solar-icons/react/linear";
import { CartCount } from "@/components/cart/cart-count";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-primary bg-surface-primary/95 backdrop-blur">
      <div className="safe-inline mx-auto flex h-16 max-w-7xl items-center justify-between gap-4">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-t3" aria-label="Tapsi Store home">
          <span className="grid size-9 place-items-center rounded-t3 bg-brand text-on-brand" aria-hidden="true">
            <HomeIcon size={20} />
          </span>
          <span className="type-headline-sm">Tapsi Store</span>
        </Link>

        <nav aria-label="Primary navigation" className="flex items-center gap-2">
          <Link href="/" className="focus-ring rounded-t3 px-3 py-2 type-label-sm text-content-secondary transition hover:bg-surface-secondary hover:text-content-primary">
            Products
          </Link>
          <Link href="/cart" className="focus-ring relative inline-flex min-h-11 items-center gap-2 rounded-t3 px-3 py-2 type-label-sm text-content-primary transition hover:bg-surface-secondary" aria-label="Shopping cart">
            <CartLarge2Icon size={20} aria-hidden="true" />
            <span className="hidden sm:inline">Cart</span>
            <CartCount />
          </Link>
        </nav>
      </div>
    </header>
  );
}
