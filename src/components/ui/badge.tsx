import type { ReactNode } from "react";

type Tone = "neutral" | "positive" | "negative" | "brand";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-secondary text-content-secondary",
  positive: "bg-surface-positive-light text-content-positive",
  negative: "bg-surface-negative-light text-content-negative",
  brand: "bg-[var(--tapsi-palette-orange-50)] text-[var(--tapsi-palette-orange-600)]",
};

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return <span className={`inline-flex items-center rounded-pill px-2.5 py-1 type-label-sm ${tones[tone]}`}>{children}</span>;
}
