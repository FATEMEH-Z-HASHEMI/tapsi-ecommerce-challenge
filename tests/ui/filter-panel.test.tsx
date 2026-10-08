import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ComponentProps } from "react";
import { FilterPanel } from "@/components/catalog/filter-panel";

function renderPanel(overrides: Partial<ComponentProps<typeof FilterPanel>> = {}) {
  const props: ComponentProps<typeof FilterPanel> = {
    categories: ["Apparel", "Home"],
    selectedCategories: [],
    minPrice: "",
    maxPrice: "",
    inStockOnly: false,
    priceError: null,
    onCategoryChange: vi.fn(),
    onMinPriceChange: vi.fn(),
    onMaxPriceChange: vi.fn(),
    onStockChange: vi.fn(),
    onClear: vi.fn(),
    ...overrides,
  };
  render(<FilterPanel {...props} />);
  return props;
}

describe("FilterPanel", () => {
  it("reports category changes", () => {
    const props = renderPanel();
    fireEvent.click(screen.getByLabelText("Apparel"));
    expect(props.onCategoryChange).toHaveBeenCalledWith("Apparel", true);
  });

  it("reports price input changes", () => {
    const props = renderPanel();
    fireEvent.change(screen.getByLabelText("Min ($)"), { target: { value: "75" } });
    expect(props.onMinPriceChange).toHaveBeenCalledWith("75");
  });

  it("exposes price validation errors accessibly", () => {
    renderPanel({ priceError: "Minimum price cannot be greater than maximum price." });
    expect(screen.getByRole("alert")).toHaveTextContent("Minimum price");
    expect(screen.getByLabelText("Min ($)")).toHaveAttribute("aria-invalid", "true");
  });

  it("supports clearing filters", () => {
    const props = renderPanel();
    fireEvent.click(screen.getByRole("button", { name: "Clear all" }));
    expect(props.onClear).toHaveBeenCalledOnce();
  });
});
