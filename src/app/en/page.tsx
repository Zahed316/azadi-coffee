import Link from "next/link";
import { PageStackLayout } from "@/components/page-stack/PageStackLayout";
import type { StackPanel } from "@/components/page-stack/PagePanel";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { HeroSection } from "@/components/sections/HeroSection";
import { getProducts } from "@/data/products";
import { getPosts } from "@/data/posts";
import { getLandingSettings } from "@/lib/theme-settings";

export const metadata = { title: "Azadi Coffee" };

export default async function EnglishHome() {
  const [products, posts, landingSettings] = await Promise.all([getProducts("en"), getPosts("en"), getLandingSettings("en")]);

  const panels: StackPanel[] = [
    {
    id: "home",
    label: "Home",
    eyebrow: "Azadi Coffee",
    title: "Azadi Coffee for precise, simple, everyday cups.",
    children: <HeroSection locale="en" settings={landingSettings} />,
  },
  {
    id: "shop",
    label: "Shop",
    eyebrow: "Ready-to-ship coffees",
    title: "Buying coffee should feel short, clear, and calm.",
    tone: "warm",
    children: (
      <div>
        <FeaturedProducts products={products} locale="en" />
        <Link href="/en/shop" className="mt-8 inline-flex min-h-12 items-center border border-ink bg-ink px-5 py-3 font-bold text-white">
          Enter the shop
        </Link>
      </div>
    ),
  },
  {
    id: "roastery",
    label: "Roastery",
    eyebrow: "Profile and consistency",
    title: "A small roastery focused on clarity, repeatability, and freshness.",
    children: (
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Green selection", "Green coffee selected by season, transparency, and cup quality."],
          ["Profile logging", "Time, temperature, and development tracked for every roast batch."],
          ["Regular shipping", "Packed after proper rest and shipped on a short, predictable rhythm."],
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
    label: "Journal",
    eyebrow: "Roastery notes",
    title: "Guides for buying, brewing, and understanding coffee origins.",
    tone: "warm",
    children: (
      <div className="grid border-t border-ink">
        {posts.map((post) => (
          <Link key={post.slug} href={`/en/blog/${post.slug}`} className="grid gap-3 border-b border-ink py-5 md:grid-cols-[160px_1fr]">
            <p className="text-sm text-stone">{post.categoryEn}</p>
            <div>
              <h3 className="text-xl font-bold">{post.titleEn}</h3>
              <p className="mt-2 leading-8 text-stone">{post.excerptEn}</p>
            </div>
          </Link>
        ))}
      </div>
    ),
  },
  {
    id: "about",
    label: "About",
    eyebrow: "Azadi identity",
    title: "A minimal Persian coffee brand built for daily buying.",
    children: (
      <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <p className="max-w-2xl text-lg leading-9 text-stone">
          Azadi uses a black-and-white visual rhythm, exact spacing, and adjacent page panels to make shopping feel quiet and deliberate.
          The product, voice, and content are built around specialty coffee and the Iranian market.
        </p>
        <div className="grid border border-ink">
          {["Minimal", "Persian-first", "Product-led", "Standalone, no CMS"].map((item) => (
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
    label: "Contact",
    eyebrow: "Orders and partnerships",
    title: "Contact Azadi for coffee orders, cafe supply, or wholesale collaboration.",
    tone: "ink",
    children: (
      <div className="grid gap-6 text-white/75 md:grid-cols-2">
        <div className="border border-white/30 p-5 leading-8">
          <p>Tehran, Azadi roastery</p>
          <p className="ltr">021-00000000</p>
          <p>Saturday to Thursday, 10:00-18:00</p>
        </div>
        <div className="flex flex-wrap items-start gap-3">
          <Link href="/en/contact" className="border border-paper px-5 py-3 font-bold text-paper">
            Contact page
          </Link>
          <Link href="/en/wholesale" className="border border-paper bg-paper px-5 py-3 font-bold text-ink">
            Wholesale request
          </Link>
        </div>
      </div>
    ),
  },
  ];

  return <PageStackLayout panels={panels} locale="en" />;
}
