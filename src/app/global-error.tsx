"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="fa" dir="rtl" className="h-full antialiased">
      <body className="min-h-full bg-paper text-ink">
        <div className="container-shell grid min-h-screen place-items-center py-12">
          <div className="max-w-md text-center">
            <h1 className="text-4xl font-bold">خطای سیستمی</h1>
            <p className="mt-4 leading-8 text-stone">
              مشکلی جدی پیش آمد. لطفا صفحه را رفرش کنید یا بعدا تلاش کنید.
            </p>
            <button
              onClick={() => reset()}
              className="mt-6 inline-flex min-h-11 items-center border border-ink bg-ink px-5 font-bold text-paper transition hover:bg-paper hover:text-ink"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
