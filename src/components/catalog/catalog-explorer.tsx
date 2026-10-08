"use client";

import { useMemo, useState } from "react";
import { FilterIcon } from "@solar-icons/react/linear";
import { FilterPanel } from "@/components/catalog/filter-panel";
import { MobileFilterDialog } from "@/components/catalog/mobile-filter-dialog";
import { ProductCard } from "@/components/products/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { productCategories } from "@/data/products";
import { dollarsToCents } from "@/lib/currency";
import { filterProducts, hasActiveFilters, validatePriceRange } from "@/lib/catalog";
import type { Product, ProductCategory, ProductFilterState } from "@/types/domain";

const EMPTY_FILTERS: ProductFilterState = {
  categories: [],
  inStockOnly: false,
};

export function CatalogExplorer({ products }: { products: Product[] }) {
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const minCents = dollarsToCents(minPrice);
  const maxCents = dollarsToCents(maxPrice);
  const invalidMin = minPrice.trim() !== "" && minCents === undefined;
  const invalidMax = maxPrice.trim() !== "" && maxCents === undefined;
  const rangeError = invalidMin || invalidMax ? "Enter a valid non-negative price." : validatePriceRange(minCents, maxCents);

  const filters: ProductFilterState = {
    categories: selectedCategories,
    minPriceCents: minCents,
    maxPriceCents: maxCents,
    inStockOnly,
  };

  const visibleProducts = useMemo(
    () => (rangeError ? products : filterProducts(products, filters)),
    [products, selectedCategories, minCents, maxCents, inStockOnly, rangeError],
  );

  const clearFilters = () => {
    setSelectedCategories(EMPTY_FILTERS.categories);
    setMinPrice("");
    setMaxPrice("");
    setInStockOnly(false);
  };

  const handleCategory = (category: ProductCategory, checked: boolean) => {
    setSelectedCategories((current) =>
      checked ? [...current, category] : current.filter((item) => item !== category),
    );
  };

  const panel = (
    <FilterPanel
      categories={productCategories}
      selectedCategories={selectedCategories}
      minPrice={minPrice}
      maxPrice={maxPrice}
      inStockOnly={inStockOnly}
      priceError={rangeError}
      onCategoryChange={handleCategory}
      onMinPriceChange={setMinPrice}
      onMaxPriceChange={setMaxPrice}
      onStockChange={setInStockOnly}
      onClear={clearFilters}
    />
  );

  const active = hasActiveFilters(filters);

  return (
    <div className="grid gap-6 md:grid-cols-[15rem_minmax(0,1fr)] lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-8">
      <aside className="hidden self-start rounded-t5 border border-border-primary bg-surface-primary p-5 md:block" aria-label="Product filters">
        {panel}
      </aside>

      <section aria-labelledby="products-heading" className="min-w-0">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="products-heading" className="type-headline-md">
              Products
            </h2>
            <p className="mt-1 type-body-sm text-content-secondary" aria-live="polite">
              {rangeError ? "Fix the price range to apply price filtering." : `${visibleProducts.length} of ${products.length} products`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {active ? <Badge tone="brand">Filters active</Badge> : null}
            <Button variant="ghost" className="md:hidden" onClick={() => setMobileFiltersOpen(true)} aria-haspopup="dialog">
              <FilterIcon size={18} aria-hidden="true" />
              Filters
            </Button>
          </div>
        </div>

        {visibleProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-t5 border border-dashed border-border-primary bg-surface-primary p-8 text-center sm:p-12">
            <h3 className="type-headline-sm">No products match these filters</h3>
            <p className="mx-auto mt-2 max-w-md type-body-sm text-content-secondary">
              Try widening the price range, selecting fewer categories, or showing out-of-stock items.
            </p>
            <Button variant="ghost" onClick={clearFilters} className="mt-5">
              Clear filters
            </Button>
          </div>
        )}
      </section>

      <MobileFilterDialog open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)}>
        {panel}
      </MobileFilterDialog>
    </div>
  );
}
