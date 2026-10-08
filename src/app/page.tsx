import { CatalogExplorer } from "@/components/catalog/catalog-explorer";
import { products } from "@/data/products";

export default function HomePage() {
  return (
    <div className="safe-inline mx-auto max-w-7xl py-8 sm:py-10 lg:py-12">
      <section className="mb-8 overflow-hidden rounded-t6 border border-border-primary brand-soft-gradient p-6 sm:p-8 lg:p-10">
        <div className="max-w-2xl">
          <p className="type-label-sm text-[var(--tapsi-palette-orange-600)]">Tapsi Design System storefront</p>
          <h1 className="mt-2 type-display-sm text-content-primary sm:text-[var(--tapsi-typography-display-md-size)]">
            Everyday essentials, thoughtfully selected.
          </h1>
          <p className="mt-3 max-w-xl text-content-secondary">
            Explore practical apparel, accessories, electronics, and home goods in a responsive shopping experience built for clarity and speed.
          </p>
        </div>
      </section>

      <CatalogExplorer products={products} />
    </div>
  );
}
