import type { Product, ProductOptionName, ProductVariant, VariantSelections } from "../types/domain.js";

export function selectionMatchesVariant(
  variant: ProductVariant,
  selections: VariantSelections,
): boolean {
  return Object.entries(selections).every(
    ([name, value]) => value === undefined || variant.selections[name as ProductOptionName] === value,
  );
}

export function resolveVariant(
  product: Product,
  selections: VariantSelections,
): ProductVariant | undefined {
  if (!product.variants?.length || !product.options?.length) return undefined;

  const complete = product.options.every((option) => Boolean(selections[option.name]));
  if (!complete) return undefined;

  return product.variants.find((variant) => selectionMatchesVariant(variant, selections));
}

export function isOptionValueAvailable(
  product: Product,
  optionName: ProductOptionName,
  value: string,
  currentSelections: VariantSelections,
): boolean {
  if (!product.variants?.length) return false;

  const proposed: VariantSelections = { ...currentSelections, [optionName]: value };

  return product.variants.some(
    (variant) => variant.stock > 0 && selectionMatchesVariant(variant, proposed),
  );
}

export function variantSelectionsLabel(selections: VariantSelections): string {
  return Object.values(selections).filter(Boolean).join(" · ");
}
