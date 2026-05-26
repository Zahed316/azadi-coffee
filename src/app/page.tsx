import Link from "next/link";
import { PageStackLayout } from "@/components/page-stack/PageStackLayout";
import type { StackPanel } from "@/components/page-stack/PagePanel";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { HeroSection } from "@/components/sections/HeroSection";
import { getProducts } from "@/data/products";
import { getPosts } from "@/data/posts";
import { getLandingSettings } from "@/lib/theme-settings";

export default async function Home() {
  const [products, posts, landingSettings] = await Promise.all([getProducts("fa"), getPosts("fa"), getLandingSettings("fa")]);

  const panels: StackPanel[] = [
    {
    id: "home",
    label: "خانه",
    eyebrow: "Azadi Coffee",
    title: "قهوه آزادی برای فنجان های دقیق، ساده و روزانه.",
    children: <HeroSection settings={landingSettings} />,
  },
  {
    id: "shop",
    label: "فروشگاه",
    eyebrow: "قهوه های آماده ارسال",
    title: "خرید قهوه باید کوتاه، واضح و آرام باشد.",
    tone: "warm",
    children: (
      <div>
        <FeaturedProducts products={products} />
        <Link href="/shop" className="mt-8 inline-flex border border-ink bg-ink px-5 py-3 font-bold text-paper">
          ورود به فروشگاه
        </Link>
      </div>
    ),
  },
  {
    id: "roastery",
    label: "برشته کاری",
    eyebrow: "پروفایل و ثبات",
    title: "برشته کاری کوچک با تمرکز روی وضوح، تکرارپذیری و تازگی.",
    children: (
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["انتخاب سبز", "خرید دانه سبز براساس فصل، شفافیت و کیفیت فنجان."],
          ["ثبت پروفایل", "کنترل زمان، دما و توسعه برای هر دسته برشته کاری."],
          ["ارسال منظم", "بسته بندی بعد از استراحت مناسب و ارسال کوتاه."],
        ].map(([title, text]) => (
          <article key={title} className="border-t border-ink pt-4">
            <h3 className="font-bold">{title}</h3>
            <p className="mt-3 leading-8 text-stone">{text}</p>
          </article>
        ))}
      </div>
    ),
  },
  {
    id: "blog",
    label: "بلاگ",
    eyebrow: "یادداشت های برشته کاری",
    title: "آموزش خرید، دم آوری و شناخت خاستگاه قهوه.",
    tone: "warm",
    children: (
      <div className="grid border-t border-ink">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="grid gap-3 border-b border-ink py-5 md:grid-cols-[160px_1fr]">
            <p className="text-sm text-stone">{post.category}</p>
            <div>
              <h3 className="text-xl font-bold">{post.title}</h3>
              <p className="mt-2 leading-8 text-stone">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    ),
  },
  {
    id: "about",
    label: "درباره",
    eyebrow: "هویت آزادی",
    title: "یک برند قهوه فارسی، مینیمال و مناسب خرید روزمره.",
    children: (
      <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <p className="max-w-2xl text-lg leading-9 text-stone">
          آزادی از زبان بصری سیاه و سفید، فاصله گذاری دقیق و صفحات کنار هم برای ساختن تجربه ای آرام استفاده می کند؛ اما محتوا،
          محصول و هویت آن برای قهوه تخصصی و بازار فارسی طراحی شده است.
        </p>
        <div className="grid border border-ink">
          {["مینیمال", "فارسی و راست چین", "محصول محور", "آماده اتصال به WooCommerce"].map((item) => (
            <p key={item} className="border-b border-ink p-4 last:border-b-0">
              {item}
            </p>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "contact",
    label: "تماس",
    eyebrow: "سفارش و همکاری",
    title: "برای خرید، تامین قهوه کافه یا همکاری عمده با آزادی تماس بگیرید.",
    tone: "ink",
    children: (
      <div className="grid gap-6 text-white/75 md:grid-cols-2">
        <div className="border border-white/30 p-5 leading-8">
          <p>تهران، کارگاه برشته کاری آزادی</p>
          <p className="ltr text-right">021-00000000</p>
          <p>شنبه تا پنجشنبه، ۱۰ تا ۱۸</p>
        </div>
        <div className="flex flex-wrap items-start gap-3">
          <Link href="/contact" className="border border-paper px-5 py-3 font-bold text-paper">
            صفحه تماس
          </Link>
          <Link href="/wholesale" className="border border-paper bg-paper px-5 py-3 font-bold text-ink">
            درخواست عمده
          </Link>
        </div>
      </div>
    ),
  },
  ];

  return <PageStackLayout panels={panels} />;
}
