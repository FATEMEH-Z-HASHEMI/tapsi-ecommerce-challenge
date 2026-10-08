import type { ButtonHTMLAttributes, ReactNode } from "react";

const base =
  "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-t3 px-4 type-label-sm transition disabled:cursor-not-allowed disabled:opacity-50";

const variants = {
  primary:
    "bg-content-primary text-white hover:bg-[var(--tapsi-palette-gray-700)] active:bg-[var(--tapsi-palette-gray-900)]",
  brand:
    "bg-brand text-on-brand hover:bg-[var(--tapsi-palette-orange-500)] active:bg-[var(--tapsi-palette-orange-600)]",
  ghost:
    "border border-border-primary bg-surface-primary text-content-primary hover:bg-surface-secondary active:bg-surface-tertiary",
  destructive:
    "bg-surface-negative text-white hover:bg-[var(--tapsi-palette-red-500)] active:bg-[var(--tapsi-palette-red-600)]",
} as const;

export type ButtonVariant = keyof typeof variants;

export function buttonClassName(variant: ButtonVariant = "primary", extra = "") {
  return `${base} ${variants[variant]} ${extra}`.trim();
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

export function Button({ variant = "primary", className = "", type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClassName(variant, className)} {...props} />;
}
