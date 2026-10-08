import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AnchorHTMLAttributes, ImgHTMLAttributes } from "react";
import { CartView } from "@/components/cart/cart-view";

const mocks = vi.hoisted(() => ({ useCart: vi.fn() }));

vi.mock("@/components/cart/cart-provider", () => ({
  useCart: mocks.useCart,
}));
vi.mock("@solar-icons/react/linear", () => ({
  AddCircleIcon: () => <span aria-hidden="true" />,
  MinusCircleIcon: () => <span aria-hidden="true" />,
  TrashBin2Icon: () => <span aria-hidden="true" />,
}));
vi.mock("next/image", () => ({
  default: ({ alt, fill: _fill, ...props }: ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => <img alt={alt ?? ""} {...props} />,
}));
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => <a href={href} {...props}>{children}</a>,
}));

describe("CartView", () => {
  beforeEach(() => mocks.useCart.mockReset());

  it("renders the empty-cart state", () => {
    mocks.useCart.mockReturnValue({
      items: [], hydrated: true, totalQuantity: 0, subtotalCents: 0,
      setQuantity: vi.fn(), removeItem: vi.fn(), clearCart: vi.fn(),
    });
    render(<CartView />);
    expect(screen.getByRole("heading", { name: "Your cart is empty" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Browse products" })).toHaveAttribute("href", "/");
  });

  it("updates quantity through the increase control", () => {
    const setQuantity = vi.fn();
    mocks.useCart.mockReturnValue({
      items: [{ lineId: "prod-watch:base", productId: "prod-watch", selections: {}, quantity: 1 }],
      hydrated: true,
      totalQuantity: 1,
      subtotalCents: 18900,
      setQuantity,
      removeItem: vi.fn(),
      clearCart: vi.fn(),
    });
    render(<CartView />);
    fireEvent.click(screen.getByRole("button", { name: "Increase Minimal Field Watch quantity" }));
    expect(setQuantity).toHaveBeenCalledWith("prod-watch:base", 2);
    expect(screen.getByText("$189.00")).toBeInTheDocument();
  });
});
