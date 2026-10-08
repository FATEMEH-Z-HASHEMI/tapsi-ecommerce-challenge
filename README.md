# Tapsi E-commerce Template Challenge

A production-oriented front-end e-commerce template built for the internship challenge specification. The application uses Next.js App Router, strict TypeScript, Tailwind CSS, verified Tapsi Design System tokens, Vazirmatn typography, and Solar Icons.

## Implemented Features

### Product catalog

- Responsive mobile-first product grid.
- Stable local dataset with 8 realistic products across 5 categories.
- Category, minimum price, maximum price, and in-stock filters.
- Combined filtering without mutating source data.
- Active-filter indication, accurate result count, clear-all action, and empty-results state.
- Accessible desktop filter sidebar and native-dialog mobile filter experience.
- Product cards with image, category, name, price, optional original price, stock state, and functional detail route.

### Product detail page

- Dynamic `/products/[slug]` routes with static params and product-specific metadata.
- Main image plus thumbnail gallery.
- Typed color/size variants.
- Combination-aware availability: impossible or out-of-stock combinations are disabled.
- Required variant selection before cart mutation.
- Stock-aware Add to Cart behavior and user feedback.
- Breadcrumb navigation and proper not-found handling.

### Shopping cart

- Dedicated `/cart` page.
- Persistent `localStorage` cart with guarded hydration and malformed-data recovery.
- Distinct lines for different variants and quantity merging for identical variants.
- Quantity increase/decrease with stock caps.
- Explicit remove action and clear-cart action.
- Product thumbnail, selected variant summary, unit price, line subtotal, total quantity, and cart subtotal.
- Empty-cart state and live announcements for important cart changes.
- Honest `/checkout` demo route that explicitly does not claim to process payments or create real orders.

## Technology Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16.4.0, App Router |
| UI | React 19.3.0 |
| Language | TypeScript 7.0.2, strict mode |
| Styling | Tailwind CSS 4.3.3 |
| Design system | `@tapsioss/theme` 0.8.0 |
| Typography | `@fontsource/vazirmatn` 5.3.0 |
| Icons | `@solar-icons/react` 2.3.2 only |
| Tests | Vitest + Testing Library; Node test runner for dependency-free domain verification |
| Formatting | Prettier + `prettier-plugin-tailwindcss` |
| Linting | ESLint + `eslint-config-next` |

## Tapsi Design System Integration

The implementation uses the official Tapsi Design System documentation and the official `@tapsioss/theme` package rather than inventing Tapsi-specific values.

The root layout imports:

```ts
import "@tapsioss/theme/css-variables";
import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/600.css";
```

Tailwind consumes semantic Tapsi CSS variables for brand, surface, content, border, and radius values. Global typography helpers use the documented body, label, headline, and display tokens. The application intentionally keeps interaction primitives as semantic native React/HTML controls styled with Tailwind and official Tapsi tokens; this avoids mixing another rendering layer while keeping Tailwind as the primary styling system required by the challenge.

Official references used during implementation:

- https://tap30.github.io/web-components/
- https://tap30.github.io/web-components/theme.html
- https://tap30.github.io/web-components/theme/color.html
- https://tap30.github.io/web-components/theme/spacing.html
- https://tap30.github.io/web-components/theme/radius.html
- https://tap30.github.io/web-components/theme/stroke.html
- https://tap30.github.io/web-components/theme/typography.html
- https://tap30.github.io/web-components/components/button/standard.html

## Solar Icons

All UI icons come from `@solar-icons/react`, using the typed `linear` exports. No other icon family is used. Product artwork is local content imagery rather than UI iconography.

## Requirements

- Node.js 20 or newer.
- npm with access to the public npm registry.

## Installation

```bash
npm install
```

The challenge execution environment used to prepare this repository could not resolve `registry.npmjs.org`, so a lockfile could not be generated there. On a normal networked development machine, run `npm install` once and commit the generated `package-lock.json` before final public submission.

## Development

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Quality Commands

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
```

For the dependency-light domain verification used while the npm registry was unavailable:

```bash
npm run test:domain
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Product catalog and filters |
| `/products/[slug]` | Product details, gallery, variants, Add to Cart |
| `/cart` | Persistent shopping cart and totals |
| `/checkout` | Honest front-end-only demo checkout destination |
| unknown product slug | Next.js not-found state |

## Architecture

```text
src/
├── app/
│   ├── cart/
│   ├── checkout/
│   ├── products/[slug]/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── cart/
│   ├── catalog/
│   ├── layout/
│   ├── products/
│   └── ui/
├── data/
│   └── products.ts
├── lib/
│   ├── cart.ts
│   ├── catalog.ts
│   ├── currency.ts
│   └── variants.ts
└── types/
    └── domain.ts

tests/
├── cart/
├── catalog/
└── ui/

tests-domain/
```

The separation is deliberate:

- `types/` owns domain contracts.
- `data/` owns stable local catalog data.
- `lib/` owns pure business rules and calculations.
- `components/` owns reusable presentation and interactive UI.
- `app/` composes routes and metadata.
- `tests-domain/` provides dependency-free executable verification of the most important business logic.

## Cart Persistence

The cart is stored under `tapsi-store-cart-v1` in `localStorage` only after client hydration. Server render and first client render both start from the same empty state, avoiding hydration mismatch.

Persisted data is treated as untrusted input. Unknown products, invalid line IDs, malformed quantities, unavailable variants, and quantities above stock are discarded or normalized before entering application state.

## Money Handling

Product prices are stored in integer cents. Cart subtotal and line subtotals are derived from current cart state using integer arithmetic. Formatting to USD happens only at presentation boundaries.

## Accessibility Notes

- Semantic `header`, `nav`, `main`, `footer`, `section`, `article`, `fieldset`, and heading structure.
- Real links for navigation and real buttons for actions.
- Keyboard-operable filters, variants, gallery thumbnails, and cart controls.
- Visible `:focus-visible` treatment based on Tapsi focus-border tokens.
- Native `<dialog>` for mobile filters, providing Escape dismissal and browser focus behavior.
- Accessible names for icon-only controls.
- `aria-pressed` for selected gallery thumbnails and variants.
- `aria-live` feedback for result/cart changes.
- Stock/error/selection information is conveyed with text, not color alone.

## Responsive Strategy

The interface is designed mobile-first for the required target widths: 320, 375, 768, 1024, and 1440px.

- 320px: single-column catalog and compact navigation.
- 360px+: two-column product grid where space permits.
- 768px+: persistent filter sidebar.
- 1024px+: two-column PDP and sticky purchase/cart summary sections.
- 1440px: constrained 7xl content width to keep line lengths and card density comfortable.

A real-browser viewport sweep is still required after dependency installation because the preparation sandbox could not install or run Next.js.

## Tests

### Domain tests

`tests-domain/` verifies the core rules independently of React/Next.js:

- Category, price, stock, and combined filtering.
- Empty filter results and source immutability.
- Invalid price ranges.
- Same-variant merging.
- Different-variant line separation.
- Stock-bound quantity updates.
- Subtotal and total quantity calculation.
- Explicit removal.
- Malformed persisted-cart sanitization.
- Variant resolution and unavailable-combination prevention.

These tests were executed successfully in the preparation environment: **10 passed, 0 failed**.

### Vitest / Testing Library coverage

The regular `npm test` suite additionally covers:

- Catalog business logic.
- Cart business logic.
- Filter control interactions and validation messages.
- Product card content and navigation.
- PDP variant selection and Add to Cart.
- Cart empty state and quantity-control behavior.

The Vitest suite could not be executed in the preparation sandbox because dependencies could not be downloaded from npm.

## Known Limitations

1. **Environment verification gate:** the preparation sandbox has no DNS resolution for `registry.npmjs.org`, so `npm install`, lint, full typecheck, Vitest, production build, and browser-based visual inspection could not be completed there.
2. **No lockfile yet:** run `npm install` on a networked machine and commit the generated `package-lock.json` before submission.
3. **No payment/backend integration:** intentionally excluded by the challenge scope; `/checkout` clearly communicates this.
4. **No screenshots included:** genuine screenshots should only be added after the application has been run and visually inspected.

## Final Local Verification

After cloning on a machine with npm access:

```bash
npm install
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
npm run dev
```

Then visually verify at 320, 375, 768, 1024, and 1440px and commit the resulting lockfile if all checks pass.

## Git Workflow

The implementation was committed incrementally using Conventional Commits. Review with:

```bash
git log --oneline --decorate
```

No remote was configured and no GitHub push was claimed.

## Publishing to GitHub

After the final networked verification gate:

```bash
git status
git remote add origin <your-repository-url>
git push -u origin main
```

If `origin` already exists, update it instead of adding a duplicate remote.
#   t a p s i - e c o m m e r c e - c h a l l e n g e  
 