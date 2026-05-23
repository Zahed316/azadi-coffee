export type CoffeeProduct = {
  slug: string;
  name: string;
  nameEn: string;
  origin: string;
  originEn: string;
  roast: "روشن" | "متوسط" | "متوسط رو به تیره";
  roastEn: "Light" | "Medium" | "Medium-dark";
  process: string;
  processEn: string;
  weightGram: number;
  priceToman: number;
  tastingNotes: string[];
  tastingNotesEn: string[];
  brew: string;
  brewEn: string;
  inventory: "available" | "low" | "sold-out";
  image?: string;
  imageAlt?: string;
};

export const products: CoffeeProduct[] = [
  {
    slug: "kurdistan-filter",
    name: "آزادی کردستان فیلتر",
    nameEn: "Azadi Kurdistan Filter",
    origin: "ایران / کردستان",
    originEn: "Iran / Kurdistan",
    roast: "روشن",
    roastEn: "Light",
    process: "شسته",
    processEn: "Washed",
    weightGram: 250,
    priceToman: 420000,
    tastingNotes: ["زردآلو", "چای سیاه", "عسل"],
    tastingNotesEn: ["Apricot", "Black tea", "Honey"],
    brew: "V60، کمکس، فرنچ پرس سبک",
    brewEn: "V60, Chemex, light French press",
    inventory: "available",
  },
  {
    slug: "espresso-house-blend",
    name: "ترکیب اسپرسو آزادی",
    nameEn: "Azadi Espresso House Blend",
    origin: "برزیل / اتیوپی",
    originEn: "Brazil / Ethiopia",
    roast: "متوسط",
    roastEn: "Medium",
    process: "طبیعی و شسته",
    processEn: "Natural and washed",
    weightGram: 500,
    priceToman: 780000,
    tastingNotes: ["شکلات تلخ", "فندق", "مرکبات"],
    tastingNotesEn: ["Dark chocolate", "Hazelnut", "Citrus"],
    brew: "اسپرسو، موکاپات، کاپوچینو",
    brewEn: "Espresso, moka pot, cappuccino",
    inventory: "available",
  },
  {
    slug: "ethiopia-natural",
    name: "اتیوپی طبیعی",
    nameEn: "Ethiopia Natural",
    origin: "Ethiopia / Guji",
    originEn: "Ethiopia / Guji",
    roast: "روشن",
    roastEn: "Light",
    process: "طبیعی",
    processEn: "Natural",
    weightGram: 250,
    priceToman: 610000,
    tastingNotes: ["توت فرنگی", "یاس", "کاکائو"],
    tastingNotesEn: ["Strawberry", "Jasmine", "Cacao"],
    brew: "فیلتر دستی و قهوه سرد",
    brewEn: "Manual filter and cold coffee",
    inventory: "low",
  },
  {
    slug: "decaf-colombia",
    name: "کلمبیا بدون کافئین",
    nameEn: "Colombia Decaf",
    origin: "Colombia / Huila",
    originEn: "Colombia / Huila",
    roast: "متوسط رو به تیره",
    roastEn: "Medium-dark",
    process: "Sugarcane Decaf",
    processEn: "Sugarcane decaf",
    weightGram: 250,
    priceToman: 590000,
    tastingNotes: ["کارامل", "گردو", "سیب پخته"],
    tastingNotesEn: ["Caramel", "Walnut", "Baked apple"],
    brew: "اسپرسو و دم آوری روزانه",
    brewEn: "Espresso and daily brewing",
    inventory: "available",
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
