const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export function formatCurrency(cents: number): string {
  return currencyFormatter.format(cents / 100);
}

export function dollarsToCents(value: string): number | undefined {
  const normalized = value.trim();
  if (normalized === "") return undefined;

  const amount = Number(normalized);
  if (!Number.isFinite(amount) || amount < 0) return undefined;

  return Math.round(amount * 100);
}
