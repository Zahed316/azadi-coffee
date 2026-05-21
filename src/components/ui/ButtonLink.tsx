import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function ButtonLink({ href, children, variant = "primary" }: Props) {
  const classes =
    variant === "primary"
      ? "inline-flex min-h-11 items-center justify-center border border-ink bg-ink px-5 py-2.5 text-sm font-bold text-paper transition hover:bg-paper hover:text-ink"
      : "inline-flex min-h-11 items-center justify-center border border-ink bg-paper px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-ink hover:text-paper";

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
