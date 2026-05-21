import Link from "next/link";

const nav = [
  ["فروشگاه", "/shop"],
  ["وبلاگ", "/blog"],
  ["درباره", "/about"],
  ["برشته کاری", "/roastery"],
  ["عمده", "/wholesale"],
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink bg-paper/95 backdrop-blur">
      <div className="container-shell flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          قهوه آزادی
        </Link>
        <nav className="hidden items-center gap-7 text-sm md:flex">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="text-stone transition hover:text-ink">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 text-sm">
          <Link href="/contact" className="hidden border border-ink px-3 py-2 md:inline-flex">
            تماس
          </Link>
          <Link href="/cart" className="border border-ink bg-ink px-3 py-2 text-paper">
            سبد خرید
          </Link>
        </div>
      </div>
    </header>
  );
}
