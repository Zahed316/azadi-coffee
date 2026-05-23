export type BlogPost = {
  slug: string;
  title: string;
  titleEn: string;
  category: string;
  categoryEn: string;
  date: string;
  dateEn: string;
  excerpt: string;
  excerptEn: string;
  body: string[];
  bodyEn: string[];
};

export const posts: BlogPost[] = [
  {
    slug: "how-to-buy-fresh-coffee",
    title: "چطور قهوه تازه برای خانه انتخاب کنیم؟",
    titleEn: "How to choose fresh coffee for home",
    category: "آموزش خرید قهوه",
    categoryEn: "Coffee buying guide",
    date: "۱۴۰۵/۰۳/۰۱",
    dateEn: "May 22, 2026",
    excerpt: "یک راهنمای کوتاه برای انتخاب خاستگاه، درجه برشته کاری و وزن مناسب.",
    excerptEn: "A short guide to choosing origin, roast level, and the right bag size.",
    body: [
      "اول از روش دم آوری شروع کنید. اسپرسو به قهوه ای نیاز دارد که در شیر هم شخصیت خود را حفظ کند، اما فیلتر دستی به شفافیت و اسیدیته کنترل شده وابسته است.",
      "بعد به تاریخ برشته کاری نگاه کنید. برای اسپرسو معمولا چند روز استراحت مفید است، اما برای فیلتر، تازگی و نگهداری درست مهم تر از هر عدد تبلیغاتی است.",
    ],
    bodyEn: [
      "Start with the way you brew. Espresso needs a coffee that keeps its structure in milk, while manual filter depends more on clarity and controlled acidity.",
      "Then check the roast date. Espresso often benefits from a few days of rest, but for filter coffee, freshness and storage matter more than any marketing number.",
    ],
  },
  {
    slug: "roastery-log-first-batch",
    title: "دفتر برشته کاری: اولین ترکیب آزادی",
    titleEn: "Roastery log: the first Azadi blend",
    category: "برشته کاری",
    categoryEn: "Roastery",
    date: "۱۴۰۵/۰۲/۲۴",
    dateEn: "May 15, 2026",
    excerpt: "یادداشت کوتاه از طراحی ترکیب اسپرسو برای کافه و سفارش خانگی.",
    excerptEn: "A short note on designing an espresso blend for cafes and home orders.",
    body: [
      "ترکیب خانه آزادی برای تعادل طراحی شده است: پایه شکلاتی، عطر تمیز و پایان مزه ای که در شیر گم نمی شود.",
      "در نسخه اول، برزیل نقش بدنه را دارد و اتیوپی مقدار کمی روشنایی و عطر به فنجان اضافه می کند.",
    ],
    bodyEn: [
      "The Azadi house blend is built around balance: a chocolate base, clean aromatics, and a finish that does not disappear in milk.",
      "In the first version, Brazil carries the body while Ethiopia adds a measured amount of brightness and fragrance.",
    ],
  },
  {
    slug: "wholesale-coffee-checklist",
    title: "چک لیست خرید عمده قهوه برای کافه",
    titleEn: "Wholesale coffee checklist for cafes",
    category: "عمده فروشی",
    categoryEn: "Wholesale",
    date: "۱۴۰۵/۰۲/۱۰",
    dateEn: "May 1, 2026",
    excerpt: "قبل از قرارداد عمده، این موارد را درباره مصرف، آسیاب، آموزش و پشتیبانی روشن کنید.",
    excerptEn: "Clarify usage, grinding, training, and support before starting a wholesale contract.",
    body: [
      "خرید عمده فقط قیمت هر کیلو نیست. ثبات پروفایل، برنامه ارسال، آموزش باریستا و پاسخگویی هنگام تغییر فصل اهمیت بیشتری دارد.",
      "برای شروع، مصرف هفتگی، نوع دستگاه، منوی نوشیدنی و سطح تجربه تیم را با برشته کار شفاف کنید.",
    ],
    bodyEn: [
      "Wholesale buying is not just the price per kilo. Profile stability, delivery rhythm, barista training, and seasonal support matter more.",
      "Start by sharing weekly usage, machine type, drink menu, and your team's experience level with the roaster.",
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}
