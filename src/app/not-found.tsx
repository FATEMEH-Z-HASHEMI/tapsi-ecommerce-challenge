import Link from "next/link";
import { buttonClassName } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="safe-inline mx-auto max-w-2xl py-20 text-center">
      <p className="type-label-sm text-content-tertiary">404</p>
      <h1 className="mt-2 type-display-sm">Product not found</h1>
      <p className="mt-3 text-content-secondary">The product route you opened does not match an item in the catalog.</p>
      <Link href="/" className={buttonClassName("brand", "mt-6")}>Return to products</Link>
    </div>
  );
}
