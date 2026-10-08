import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ImgHTMLAttributes } from "react";
import { ProductDetail } from "@/components/products/product-detail";
import type { Product } from "@/types/domain";

const mocks = vi.hoisted(() => ({ addItem: vi.fn(() => true) }));

vi.mock("@/components/cart/cart-provider", () => ({
  useCart: () => ({ addItem: mocks.addItem }),
}));
vi.mock("@solar-icons/react/linear", () => ({
  CartLarge2Icon: () => <span aria-hidden="true" />,
  CheckCircleIcon: () => <span aria-hidden="true" />,
}));
vi.mock("next/image", () => ({
  default: ({ alt, fill: _fill, priority: _priority, ...props }: ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => <img alt={alt ?? ""} {...props} />,
}));

const product: Product = {
  id: "shoe",
  slug: "shoe",
  name: "Test Sneaker",
  description: "A test sneaker",
  category: "Footwear",
  priceCents: 12000,
  images: [{ src: "/shoe.svg", alt: "Test sneaker" }],
  stock: 0,
  options: [
    { name: "color", label: "Color", values: ["White", "Black"] },
    { name: "size", label: "Size", values: ["40", "41"] },
  ],
  variants: [
    { id: "white-40", selections: { color: "White", size: "40" }, stock: 2 },
    { id: "white-41", selections: { color: "White", size: "41" }, stock: 0 },
    { id: "black-41", selections: { color: "Black", size: "41" }, stock: 1 },
  ],
};

describe("ProductDetail", () => {
  beforeEach(() => mocks.addItem.mockClear());

  it("requires a valid variant before adding to cart", () => {
    render(<ProductDetail product={product} />);
    expect(screen.getByRole("button", { name: "Choose options" })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "White" }));
    expect(screen.getByRole("button", { name: "41" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "40" }));

    fireEvent.click(screen.getByRole("button", { name: "Add to cart" }));
    expect(mocks.addItem).toHaveBeenCalledWith(product, "white-40", { color: "White", size: "40" });
    expect(screen.getByRole("status")).toHaveTextContent("Added to your cart");
  });
});
