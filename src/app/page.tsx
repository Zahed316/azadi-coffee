import { posts } from "@/data/posts";
import { products } from "@/data/products";
import { BlogCard } from "@/components/blog/BlogCard";
import { PageShell } from "@/components/layout/PageShell";
import { ProductCard } from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui/ButtonLink";

export default function Home() {
  return (
    <PageShell>
      <section className="border-b border-ink">
        <div className="container-shell grid min-h-[68vh] gap-10 py-10 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div className="pb-8">
            <p className="mb-5 text-sm font-bold text-stone">قهوه تازه برشته / فروش آنلاین / تهران</p>
            <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              قهوه آزادی برای فنجان های دقیق، ساده و روزانه.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-9 text-stone">
              یک فروشگاه فارسی و راست چین برای قهوه تخصصی، با ریتم مینیمال سیاه و سفید، محصول محوری و مسیر خرید کوتاه.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/shop">خرید قهوه</ButtonLink>
              <ButtonLink href="/wholesale" variant="secondary">درخواست عمده</ButtonLink>
            </div>
          </div>
          <div className="grid aspect-square border border-ink bg-warm-paper p-5">
            <div className="grid place-items-center border border-ink bg-paper">
              <div className="grid h-56 w-56 place-items-center rounded-full border-[34px] border-ink">
                <span className="text-sm font-bold">AZADI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-bold text-stone">محصولات منتخب</p>
            <h2 className="mt-2 text-3xl font-bold">قهوه های آماده ارسال</h2>
          </div>
          <ButtonLink href="/shop" variant="secondary">همه محصولات</ButtonLink>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>
      </section>

      <section className="border-y border-ink bg-warm-paper">
        <div className="container-shell grid gap-8 py-14 md:grid-cols-3">
          {[
            ["۰۱", "برشته کاری کوچک", "پروفایل ها برای ثبات، وضوح و استفاده روزانه طراحی می شوند."],
            ["۰۲", "پرداخت ایرانی", "درگاه ها در WooCommerce مدیریت می شوند تا سفارش و تسویه قابل اتکا بماند."],
            ["۰۳", "محتوای فارسی", "وبلاگ برای آموزش خرید، دم آوری و روایت خاستگاه قهوه ساخته می شود."],
          ].map(([num, title, text]) => (
            <article key={num} className="border-r border-ink pr-5">
              <p className="font-mono text-sm">{num}</p>
              <h3 className="mt-4 text-xl font-bold">{title}</h3>
              <p className="mt-3 leading-8 text-stone">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-3xl font-bold">یادداشت های برشته کاری</h2>
          <ButtonLink href="/blog" variant="secondary">وبلاگ</ButtonLink>
        </div>
        {posts.slice(0, 2).map((post) => <BlogCard key={post.slug} post={post} />)}
      </section>
    </PageShell>
  );
}
