export default function LoadingPage() {
  return (
    <div className="container-shell grid min-h-[60vh] place-items-center py-12">
      <div className="max-w-md text-center">
        <div className="mx-auto h-8 w-8 animate-pulse rounded-full bg-coffee" />
        <p className="mt-4 text-stone">در حال بارگذاری...</p>
      </div>
    </div>
  );
}
