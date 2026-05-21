export type CoffeeProduct = {
  slug: string;
  name: string;
  origin: string;
  roast: "روشن" | "متوسط" | "متوسط رو به تیره";
  process: string;
  weightGram: number;
  priceToman: number;
  tastingNotes: string[];
  brew: string;
  inventory: "available" | "low" | "sold-out";
};

export const products: CoffeeProduct[] = [
  {
    slug: "kurdistan-filter",
    name: "آزادی کردستان فیلتر",
    origin: "ایران / کردستان",
    roast: "روشن",
    process: "شسته",
    weightGram: 250,
    priceToman: 420000,
    tastingNotes: ["زردآلو", "چای سیاه", "عسل"],
    brew: "V60، کمکس، فرنچ پرس سبک",
    inventory: "available",
  },
  {
    slug: "espresso-house-blend",
    name: "ترکیب اسپرسو آزادی",
    origin: "برزیل / اتیوپی",
    roast: "متوسط",
    process: "طبیعی و شسته",
    weightGram: 500,
    priceToman: 780000,
    tastingNotes: ["شکلات تلخ", "فندق", "مرکبات"],
    brew: "اسپرسو، موکاپات، کاپوچینو",
    inventory: "available",
  },
  {
    slug: "ethiopia-natural",
    name: "اتیوپی طبیعی",
    origin: "Ethiopia / Guji",
    roast: "روشن",
    process: "طبیعی",
    weightGram: 250,
    priceToman: 610000,
    tastingNotes: ["توت فرنگی", "یاس", "کاکائو"],
    brew: "فیلتر دستی و قهوه سرد",
    inventory: "low",
  },
  {
    slug: "decaf-colombia",
    name: "کلمبیا بدون کافئین",
    origin: "Colombia / Huila",
    roast: "متوسط رو به تیره",
    process: "Sugarcane Decaf",
    weightGram: 250,
    priceToman: 590000,
    tastingNotes: ["کارامل", "گردو", "سیب پخته"],
    brew: "اسپرسو و دم آوری روزانه",
    inventory: "available",
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
