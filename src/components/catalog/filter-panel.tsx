import type { ProductCategory } from "@/types/domain";

interface FilterPanelProps {
  categories: ProductCategory[];
  selectedCategories: ProductCategory[];
  minPrice: string;
  maxPrice: string;
  inStockOnly: boolean;
  priceError: string | null;
  onCategoryChange: (category: ProductCategory, checked: boolean) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onStockChange: (checked: boolean) => void;
  onClear: () => void;
}

export function FilterPanel({
  categories,
  selectedCategories,
  minPrice,
  maxPrice,
  inStockOnly,
  priceError,
  onCategoryChange,
  onMinPriceChange,
  onMaxPriceChange,
  onStockChange,
  onClear,
}: FilterPanelProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="type-headline-sm">Filters</h2>
        <button type="button" onClick={onClear} className="focus-ring rounded-t2 px-1 py-1 type-label-sm text-content-accent hover:underline">
          Clear all
        </button>
      </div>

      <fieldset>
        <legend className="mb-3 type-label-md">Category</legend>
        <div className="space-y-2">
          {categories.map((category) => {
            const id = `category-${category.toLowerCase()}`;
            return (
              <label key={category} htmlFor={id} className="flex min-h-10 cursor-pointer items-center gap-3 rounded-t3 px-2 transition hover:bg-surface-secondary">
                <input
                  id={id}
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={(event) => onCategoryChange(category, event.target.checked)}
                  className="size-4 accent-[var(--tapsi-color-brand)]"
                />
                <span className="type-body-sm">{category}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 type-label-md">Price range</legend>
        <div className="grid grid-cols-2 gap-3">
          <label className="space-y-1.5 type-body-sm text-content-secondary">
            <span>Min ($)</span>
            <input
              inputMode="decimal"
              type="number"
              min="0"
              step="1"
              value={minPrice}
              onChange={(event) => onMinPriceChange(event.target.value)}
              aria-invalid={Boolean(priceError)}
              aria-describedby={priceError ? "price-error" : undefined}
              className="focus-ring min-h-11 w-full rounded-t3 border border-border-primary bg-surface-primary px-3 text-content-primary placeholder:text-content-tertiary"
              placeholder="0"
            />
          </label>
          <label className="space-y-1.5 type-body-sm text-content-secondary">
            <span>Max ($)</span>
            <input
              inputMode="decimal"
              type="number"
              min="0"
              step="1"
              value={maxPrice}
              onChange={(event) => onMaxPriceChange(event.target.value)}
              aria-invalid={Boolean(priceError)}
              aria-describedby={priceError ? "price-error" : undefined}
              className="focus-ring min-h-11 w-full rounded-t3 border border-border-primary bg-surface-primary px-3 text-content-primary placeholder:text-content-tertiary"
              placeholder="500"
            />
          </label>
        </div>
        {priceError ? (
          <p id="price-error" role="alert" className="mt-2 type-body-sm text-content-negative">
            {priceError}
          </p>
        ) : null}
      </fieldset>

      <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-t3 border border-border-primary px-3 py-2 transition hover:bg-surface-secondary">
        <span className="type-label-sm">In-stock only</span>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(event) => onStockChange(event.target.checked)}
          className="size-4 accent-[var(--tapsi-color-brand)]"
        />
      </label>
    </div>
  );
}
