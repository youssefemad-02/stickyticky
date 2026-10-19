export type Category = {
  slug: string;
  name: { en: string; ar: string };
  description: { en: string; ar: string };
  visual: string;
};

export type Product = {
  id: string;
  slug: string;
  category: string;
  name: { en: string; ar: string };
  description: { en: string; ar: string };
  image: string;
  price: number | null;
  sizes: { id: string; label: { en: string; ar: string }; price: number | null }[];
  isDemo: true;
};

/**
 * Demonstration content only. Prices are intentionally null so no invented
 * price can be mistaken for an actual Sticky Ticky price.
 * Replace with approved brand assets and Supabase data before launch.
 */
export const categories: Category[] = [
  {
    slug: "single-stickers",
    name: { en: "Single Stickers", ar: "ستيكرز سينجل" },
    description: { en: "Individual stickers in different sizes.", ar: "استيكرز منفردة بأكتر من مقاس." },
    visual: "single",
  },
  {
    slug: "sticker-sheets",
    name: { en: "Sticker Sheets", ar: "شيتات ستيكرز" },
    description: { en: "A collection of stickers on one sheet.", ar: "مجموعة استيكرز في شيت واحد." },
    visual: "sheet",
  },
  {
    slug: "visa-stickers",
    name: { en: "Visa Stickers", ar: "ستيكرز الفيزا" },
    description: { en: "Card stickers made for your style.", ar: "استيكرز للكروت بتصميمات مختلفة." },
    visual: "card",
  },
];

export const demoProducts: Product[] = [
  {
    id: "demo-single-01",
    slug: "single-sticker-demo",
    category: "single-stickers",
    name: { en: "Single Sticker — Demo", ar: "ستيكر سينجل — نموذج تجريبي" },
    description: { en: "Demo product. Replace this copy and image with an approved design.", ar: "منتج تجريبي. استبدل الوصف والصورة بتصميم معتمد." },
    image: "/images/product-placeholder.svg",
    price: null,
    sizes: [
      { id: "small", label: { en: "Small", ar: "صغير" }, price: null },
      { id: "medium", label: { en: "Medium", ar: "متوسط" }, price: null },
      { id: "large", label: { en: "Large", ar: "كبير" }, price: null },
    ],
    isDemo: true,
  },
  {
    id: "demo-sheet-01",
    slug: "sticker-sheet-demo",
    category: "sticker-sheets",
    name: { en: "Sticker Sheet — Demo", ar: "شيت ستيكرز — نموذج تجريبي" },
    description: { en: "Demo product. Add the real sheet artwork and details.", ar: "منتج تجريبي. أضف صورة الشيت الحقيقية والتفاصيل." },
    image: "/images/product-placeholder.svg",
    price: null,
    sizes: [{ id: "standard", label: { en: "Standard sheet", ar: "شيت عادي" }, price: null }],
    isDemo: true,
  },
  {
    id: "demo-card-01",
    slug: "visa-sticker-demo",
    category: "visa-stickers",
    name: { en: "Card Sticker — Demo", ar: "ستيكر كارت — نموذج تجريبي" },
    description: { en: "Demo product. Confirm compatibility and approved design before publishing.", ar: "منتج تجريبي. تأكد من التوافق والتصميم المعتمد قبل النشر." },
    image: "/images/product-placeholder.svg",
    price: null,
    sizes: [{ id: "standard", label: { en: "Standard", ar: "عادي" }, price: null }],
    isDemo: true,
  },
];
