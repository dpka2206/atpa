import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "ink" | "accent" | "ghost" | "ghost-light" | "soft" | "lime";

const variants: Record<Variant, string> = {
  ink: "bg-ink text-white hover:bg-ink-soft",
  accent: "bg-accent text-white hover:bg-accent-bright",
  lime: "bg-accent text-white hover:bg-accent-bright",
  ghost:
    "bg-transparent text-ink border border-ink/12 hover:border-ink/30 hover:bg-ink/[0.03]",
  "ghost-light":
    "bg-transparent text-white border border-white/25 hover:bg-white/10",
  soft: "bg-accent-soft text-accent hover:bg-accent hover:text-white",
};

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

export function Button({
  href,
  children,
  variant = "ink",
  className = "",
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-[-0.01em] transition-colors duration-200 ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
