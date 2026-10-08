import type { Product, ProductCategory } from "@/types/domain";

export const products: Product[] = [
  {
    id: "prod-backpack",
    slug: "urban-commuter-backpack",
    name: "Urban Commuter Backpack",
    description:
      "A streamlined 22L backpack with a padded laptop sleeve, water-resistant shell, and quick-access front pocket for daily travel.",
    category: "Accessories",
    priceCents: 7900,
    originalPriceCents: 9900,
    images: [{ src: "/products/UrbanCommuterBackpack.svg", alt: "Urban commuter backpack" }],
    stock: 0,
    options: [{ name: "color", label: "Color", values: ["Graphite", "Sand"] }],
    variants: [
      { id: "backpack-graphite", selections: { color: "Graphite" }, stock: 7 },
      { id: "backpack-sand", selections: { color: "Sand" }, stock: 5 },
    ],
  },
  {
    id: "prod-sneakers",
    slug: "velocity-knit-sneakers",
    name: "Velocity Knit Sneakers",
    description:
      "Breathable knit trainers with responsive cushioning and a grippy rubber outsole, designed for all-day city movement.",
    category: "Footwear",
    priceCents: 12900,
    images: [{ src: "/products/VelocityKnitSneakers.svg", alt: "Velocity knit sneakers" }],
    stock: 0,
    options: [
      { name: "color", label: "Color", values: ["White", "Black"] },
      { name: "size", label: "Size", values: ["40", "41", "42"] },
    ],
    variants: [
      { id: "sneaker-white-40", selections: { color: "White", size: "40" }, stock: 3 },
      { id: "sneaker-white-41", selections: { color: "White", size: "41" }, stock: 4 },
      { id: "sneaker-white-42", selections: { color: "White", size: "42" }, stock: 0 },
      { id: "sneaker-black-40", selections: { color: "Black", size: "40" }, stock: 2 },
      { id: "sneaker-black-41", selections: { color: "Black", size: "41" }, stock: 0 },
      { id: "sneaker-black-42", selections: { color: "Black", size: "42" }, stock: 6 },
    ],
  },
  {
    id: "prod-jacket",
    slug: "commuter-shell-jacket",
    name: "Commuter Shell Jacket",
    description:
      "A lightweight weather-resistant shell with sealed pockets, adjustable cuffs, and a packable hood for unpredictable commutes.",
    category: "Apparel",
    priceCents: 14900,
    originalPriceCents: 17900,
    images: [{ src: "/products/CommuterShellJacket.svg", alt: "Commuter shell jacket" }],
    stock: 0,
    options: [{ name: "size", label: "Size", values: ["S", "M", "L", "XL"] }],
    variants: [
      { id: "jacket-s", selections: { size: "S" }, stock: 1 },
      { id: "jacket-m", selections: { size: "M" }, stock: 5 },
      { id: "jacket-l", selections: { size: "L" }, stock: 4 },
      { id: "jacket-xl", selections: { size: "XL" }, stock: 0 },
    ],
  },
  {
    id: "prod-watch",
    slug: "minimal-field-watch",
    name: "Minimal Field Watch",
    description:
      "A clean stainless-steel timepiece with a matte dial, mineral crystal, and soft leather strap for understated everyday wear.",
    category: "Accessories",
    priceCents: 18900,
    images: [{ src: "/products/MinimalFieldWatch.svg", alt: "Minimal field watch" }],
    stock: 8,
  },
  {
    id: "prod-headphones",
    slug: "studio-wireless-headphones",
    name: "Studio Wireless Headphones",
    description:
      "Over-ear wireless headphones with balanced sound, soft memory-foam cushions, and up to 34 hours of battery life.",
    category: "Electronics",
    priceCents: 21900,
    images: [{ src: "/products/StudioWirelessHeadphones.svg", alt: "Studio wireless headphones" }],
    stock: 0,
    options: [{ name: "color", label: "Color", values: ["Graphite", "Cream"] }],
    variants: [
      { id: "headphones-graphite", selections: { color: "Graphite" }, stock: 6 },
      { id: "headphones-cream", selections: { color: "Cream" }, stock: 0 },
    ],
  },
  {
    id: "prod-bottle",
    slug: "thermal-travel-bottle",
    name: "Thermal Travel Bottle",
    description:
      "Double-wall stainless steel bottle that keeps drinks cold for 24 hours or hot for 12, with a leak-resistant cap.",
    category: "Home",
    priceCents: 3900,
    images: [{ src: "/products/ThermalTravelBottle.svg", alt: "Thermal travel bottle" }],
    stock: 18,
  },
  {
    id: "prod-lamp",
    slug: "arc-desk-lamp",
    name: "Arc Desk Lamp",
    description:
      "A compact dimmable desk lamp with warm-to-cool light control and an articulated arm for focused task lighting.",
    category: "Home",
    priceCents: 8900,
    images: [{ src: "/products/ArcDeskLamp.svg", alt: "Arc desk lamp" }],
    stock: 3,
  },
  {
    id: "prod-camera",
    slug: "pocket-street-camera",
    name: "Pocket Street Camera",
    description:
      "A compact fixed-lens camera with tactile controls and a bright prime lens for spontaneous everyday photography.",
    category: "Electronics",
    priceCents: 34900,
    images: [{ src: "/products/PocketStreetCamera.svg", alt: "Pocket street camera" }],
    stock: 0,
  },
];

export const productCategories: ProductCategory[] = [
  "Apparel",
  "Footwear",
  "Accessories",
  "Electronics",
  "Home",
];

export const productsById = new Map(products.map((product) => [product.id, product]));

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}
