import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-ink bg-ink text-paper">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="text-2xl font-bold">Azadi Coffee</p>
          <p className="mt-4 max-w-md leading-8 text-white/70">
            فروشگاه قهوه تخصصی فارسی برای قهوه تازه برشته، آموزش دم آوری و تامین قهوه برای کافه ها.
          </p>
        </div>
        <div className="grid gap-3 text-sm text-white/70">
          <Link href="/shop">فروشگاه</Link>
          <Link href="/blog">وبلاگ</Link>
          <Link href="/wholesale">درخواست عمده</Link>
        </div>
        <div className="text-sm leading-8 text-white/70">
          <p>تهران، کارگاه برشته کاری آزادی</p>
          <p className="ltr text-right">021-00000000</p>
          <p>شنبه تا پنجشنبه، ۱۰ تا ۱۸</p>
        </div>
      </div>
    </footer>
  );
}
