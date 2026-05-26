import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-shell grid min-h-[60vh] place-items-center py-12">
      <div className="max-w-md text-center">
        <p className="font-mono text-6xl font-bold text-stone">404</p>
        <h1 className="mt-4 text-3xl font-bold">صفحه مورد نظر پیدا نشد</h1>
        <p className="mt-4 leading-8 text-stone">
          صفحه‌ای که به دنبال آن هستید وجود ندارد یا منتقل شده است.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-11 items-center border border-ink bg-ink px-5 font-bold text-paper transition hover:bg-paper hover:text-ink"
        >
          بازگشت به خانه
        </Link>
      </div>
    </div>
  );
}
