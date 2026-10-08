import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/currency";
import { isProductInStock } from "@/lib/catalog";
import type { Product } from "@/types/domain";

export function ProductCard({ product }: { product: Product }) {
  const inStock = isProductInStock(product);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-t5 border border-border-primary bg-surface-primary transition hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(20,20,20,0.08)]">
      <Link
        href={`/products/${product.slug}`}
        className="focus-ring relative block aspect-square overflow-hidden bg-surface-secondary"
      >
        <Image
          src={product.images[0]?.src ?? "/products/fallback.svg"}
          alt={product.images[0]?.alt ?? product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain transition duration-300 group-hover:scale-[1.02]"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="type-body-sm text-content-tertiary">
              {product.category}
            </p>
            <h2 className="type-headline-sm mt-1 text-content-primary">
              <Link
                href={`/products/${product.slug}`}
                className="focus-ring rounded-t2 hover:underline"
              >
                {product.name}
              </Link>
            </h2>
          </div>
          <Badge tone={inStock ? "positive" : "negative"}>
            {inStock ? "In stock" : "Sold out"}
          </Badge>
        </div>

        <div className="mt-auto flex flex-col items-stretch gap-3 pt-2 min-[560px]:flex-row min-[560px]:items-end min-[560px]:justify-between">
          <div>
            <p className="type-label-md text-content-primary">
              {formatCurrency(product.priceCents)}
            </p>
            {product.originalPriceCents ? (
              <p className="type-body-sm text-content-tertiary line-through">
                {formatCurrency(product.originalPriceCents)}
              </p>
            ) : null}
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="focus-ring type-label-sm rounded-t3 border border-border-primary bg-surface-primary px-3 py-2 text-content-primary transition hover:bg-surface-secondary"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
