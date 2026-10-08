import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/products/product-detail";
import { getProductBySlug, products } from "@/data/products";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return notFound();

  return (
    <div className="safe-inline mx-auto max-w-7xl py-6 sm:py-8 lg:py-10">
      <nav aria-label="Breadcrumb" className="mb-6 type-body-sm text-content-secondary">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/" className="focus-ring rounded-t2 hover:underline">Products</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-content-primary">{product.name}</li>
        </ol>
      </nav>
      <ProductDetail product={product} />
    </div>
  );
}
