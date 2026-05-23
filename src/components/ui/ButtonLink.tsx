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
      ? "button-primary inline-flex min-h-11 items-center justify-center border px-5 py-2.5 text-sm font-bold transition"
      : "button-secondary inline-flex min-h-11 items-center justify-center border px-5 py-2.5 text-sm font-bold transition";

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
