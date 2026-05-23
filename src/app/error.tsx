"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-shell grid min-h-[60vh] place-items-center py-12">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold">خطا</h1>
        <p className="mt-4 leading-8 text-stone">
          مشکلی پیش آمد. لطفا دوباره تلاش کنید.
        </p>
        <button
          onClick={() => reset()}
          className="mt-6 inline-flex min-h-11 items-center border border-ink bg-ink px-5 font-bold text-paper transition hover:bg-paper hover:text-ink"
        >
          تلاش مجدد
        </button>
      </div>
    </div>
  );
}
