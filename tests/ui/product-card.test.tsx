import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { AnchorHTMLAttributes, ImgHTMLAttributes } from "react";
import { ProductCard } from "@/components/products/product-card";
import type { Product } from "@/types/domain";

vi.mock("next/image", () => ({
  default: ({ alt, fill: _fill, ...props }: ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => <img alt={alt ?? ""} {...props} />,
}));
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => <a href={href} {...props}>{children}</a>,
}));

const product: Product = {
  id: "watch",
  slug: "minimal-watch",
  name: "Minimal Watch",
  description: "A watch",
  category: "Accessories",
  priceCents: 18900,
  images: [{ src: "/watch.svg", alt: "Minimal watch" }],
  stock: 2,
};

describe("ProductCard", () => {
  it("shows core product information and a working product route", () => {
    render(<ProductCard product={product} />);
    expect(screen.getByRole("heading", { name: product.name })).toBeInTheDocument();
    expect(screen.getByText("$189.00")).toBeInTheDocument();
    expect(screen.getByText("In stock")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View details" })).toHaveAttribute("href", "/products/minimal-watch");
  });
});
