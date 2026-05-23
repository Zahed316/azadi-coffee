import Link from "next/link";

export function HeroSection() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
      <div>
        <p className="max-w-2xl text-lg leading-9 text-stone">
          فروشگاه فارسی و راست چین برای قهوه تازه برشته، با ریتمی شبیه صفحات کنار هم: آرام، دقیق و محصول محور.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/shop" className="border border-ink bg-ink px-5 py-3 font-bold text-paper">
            خرید قهوه
          </Link>
          <Link href="/wholesale" className="border border-ink px-5 py-3 font-bold">
            درخواست عمده
          </Link>
        </div>
      </div>
      <div className="grid aspect-square border border-ink bg-warm-paper p-5">
        <div className="grid place-items-center border border-ink bg-paper">
          <div className="grid h-48 w-48 place-items-center rounded-full border-[30px] border-ink">
            <span className="text-sm font-bold">AZADI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
