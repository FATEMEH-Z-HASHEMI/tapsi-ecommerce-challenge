"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { CartLarge2Icon, CheckCircleIcon } from "@solar-icons/react/linear";
import { useCart } from "@/components/cart/cart-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currency";
import { getProductStock } from "@/lib/catalog";
import { isOptionValueAvailable, resolveVariant } from "@/lib/variants";
import type { Product, VariantSelections } from "@/types/domain";

export function ProductDetail({ product }: { product: Product }) {
  const [imageIndex, setImageIndex] = useState(0);
  const [selections, setSelections] = useState<VariantSelections>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const { addItem } = useCart();

  const selectedVariant = useMemo(
    () => resolveVariant(product, selections),
    [product, selections],
  );
  const requiresVariant = Boolean(product.options?.length);
  const totalStock = getProductStock(product);
  const canAdd = requiresVariant
    ? Boolean(selectedVariant && selectedVariant.stock > 0)
    : totalStock > 0;

  const handleAdd = () => {
    if (!canAdd) {
      setFeedback(
        requiresVariant
          ? "Select an available option for each variant."
          : "This product is out of stock.",
      );
      return;
    }
    const added = addItem(product, selectedVariant?.id, selections);
    setFeedback(
      added ? "Added to your cart." : "This item is not currently available.",
    );
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)] lg:gap-12">
      <section aria-label="Product gallery">
        <div className="relative aspect-square overflow-hidden rounded-t6 border border-border-primary bg-surface-secondary">
          <Image
            src={product.images[imageIndex]?.src ?? "/products/fallback.svg"}
            alt={product.images[imageIndex]?.alt ?? product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-contain"
          />
        </div>

        {product.images.length > 1 ? (
          <div
            className="mt-3 grid grid-cols-4 gap-3"
            aria-label="Product image thumbnails"
          >
            {product.images.map((image, index) => (
              <button
                type="button"
                key={image.src}
                aria-label={`Show image ${index + 1} of ${product.images.length}`}
                aria-pressed={imageIndex === index}
                onClick={() => setImageIndex(index)}
                className={`focus-ring relative aspect-square overflow-hidden rounded-t3 border bg-surface-primary transition ${
                  imageIndex === index
                    ? "border-border-selected"
                    : "border-border-primary hover:border-border-selected"
                }`}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-contain"
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <section className="self-start lg:sticky lg:top-24">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{product.category}</Badge>
          <Badge tone={totalStock > 0 ? "positive" : "negative"}>
            {totalStock > 0 ? `${totalStock} available` : "Sold out"}
          </Badge>
        </div>

        <h1 className="type-display-sm mt-4">{product.name}</h1>
        <div className="mt-3 flex items-baseline gap-3">
          <p className="type-headline-md">
            {formatCurrency(product.priceCents)}
          </p>
          {product.originalPriceCents ? (
            <p className="text-content-tertiary line-through">
              {formatCurrency(product.originalPriceCents)}
            </p>
          ) : null}
        </div>
        <p className="mt-5 text-content-secondary">{product.description}</p>

        {product.options?.map((option) => (
          <fieldset key={option.name} className="mt-7">
            <legend className="type-label-md">{option.label}</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {option.values.map((value) => {
                const available = isOptionValueAvailable(
                  product,
                  option.name,
                  value,
                  selections,
                );
                const selected = selections[option.name] === value;
                return (
                  <button
                    type="button"
                    key={value}
                    disabled={!available}
                    aria-pressed={selected}
                    onClick={() => {
                      setSelections((current) => ({
                        ...current,
                        [option.name]: value,
                      }));
                      setFeedback(null);
                    }}
                    className={`focus-ring type-label-sm min-h-11 rounded-t3 border px-4 transition disabled:cursor-not-allowed disabled:border-border-primary disabled:bg-surface-secondary disabled:text-content-disabled ${
                      selected
                        ? "border-border-selected bg-content-primary text-white"
                        : "border-border-primary bg-surface-primary hover:bg-surface-secondary"
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}

        <Button
          variant="brand"
          className="mt-8 w-full sm:w-auto sm:min-w-56"
          onClick={handleAdd}
          disabled={!canAdd}
        >
          <CartLarge2Icon size={20} aria-hidden="true" />
          {canAdd
            ? "Add to cart"
            : totalStock > 0
              ? "Choose options"
              : "Out of stock"}
        </Button>

        {feedback ? (
          <p
            className={`type-body-sm mt-3 flex items-center gap-2 ${feedback.startsWith("Added") ? "text-content-positive" : "text-content-negative"}`}
            role="status"
          >
            {feedback.startsWith("Added") ? (
              <CheckCircleIcon size={18} aria-hidden="true" />
            ) : null}
            {feedback}
          </p>
        ) : null}
      </section>
    </div>
  );
}
