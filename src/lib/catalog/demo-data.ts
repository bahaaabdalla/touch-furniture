import type { Activity, Collection, Room } from "@/types/catalog";

export const demoActivity: Activity = {
  id: "activity-touch-furniture",
  slug: "touch-furniture",
  nameAr: "تاتش فرنتشر",
  nameEn: "Touch Furniture",
  type: "furniture",
  logoUrl: "/brand/touch-logo.svg",
  isPublished: true,
  settings: {
    activityId: "activity-touch-furniture",
    whatsappNumber: "201145085454",
    addressAr:
      "كفر الدوار، طريق إسكندرية الزراعي، بجوار قاعة البرنسيسة، محافظة البحيرة.",
    accentPrimary: "#6d4c3d",
    accentSecondary: "#b18b57",
  },
};

export const demoCollections: Collection[] = [
  {
    id: "collection-kids",
    activityId: demoActivity.id,
    slug: "kids-rooms",
    nameAr: "غرف أطفال",
    nameEn: "Kids Rooms",
    descriptionAr: "مساحات مرحة وهادئة تنمو مع أطفالك، بخامات عملية وتفاصيل آمنة.",
    coverUrl: "/demo/collection-kids.webp",
    sortOrder: 1,
    isPublished: true,
  },
  {
    id: "collection-master",
    activityId: demoActivity.id,
    slug: "master-bedrooms",
    nameAr: "غرف نوم كبار",
    nameEn: "Master Bedrooms",
    descriptionAr: "غرف نوم متوازنة تمنحك هدوء الفندق ودفء البيت في وقت واحد.",
    coverUrl: "/demo/collection-master.webp",
    sortOrder: 2,
    isPublished: true,
  },
  {
    id: "collection-salons",
    activityId: demoActivity.id,
    slug: "salons",
    nameAr: "صالونات",
    nameEn: "Salons",
    descriptionAr: "حضور كلاسيكي أخف، بخطوط أنيقة وأقمشة مريحة للمناسبات اليومية.",
    coverUrl: "/demo/collection-salons.webp",
    sortOrder: 3,
    isPublished: true,
  },
  {
    id: "collection-dining",
    activityId: demoActivity.id,
    slug: "dining-rooms",
    nameAr: "سفرة",
    nameEn: "Dining Rooms",
    descriptionAr: "طاولات تجمع العائلة وتمنح غرفة الطعام حضوراً واضحاً دون مبالغة.",
    coverUrl: "/demo/collection-dining.webp",
    sortOrder: 4,
    isPublished: true,
  },
  {
    id: "collection-living",
    activityId: demoActivity.id,
    slug: "living-rooms",
    nameAr: "انتريهات",
    nameEn: "Living Rooms",
    descriptionAr: "راحة يومية بتكوينات خفيفة وخامات تتحمل الاستخدام الحقيقي.",
    coverUrl: "/demo/collection-living.webp",
    sortOrder: 5,
    isPublished: true,
  },
  {
    id: "collection-sectional",
    activityId: demoActivity.id,
    slug: "sectionals",
    nameAr: "ركنة",
    nameEn: "Sectionals",
    descriptionAr: "ركنات مرنة تستفيد من المساحة وتبقي الجلسة مفتوحة ومريحة.",
    coverUrl: "/demo/collection-sectional.webp",
    sortOrder: 6,
    isPublished: true,
  },
];

const room = (
  collectionId: string,
  slug: string,
  nameAr: string,
  descriptionAr: string,
  price: number,
  stock: number,
  cover: string,
  alternate: string,
  sortOrder: number,
): Room => ({
  id: `room-${slug}`,
  collectionId,
  slug,
  nameAr,
  descriptionAr,
  price,
  currency: "ج.م",
  stock,
  coverUrl: cover,
  galleryUrls: [cover, alternate],
  sortOrder,
  isPublished: true,
});

export const demoRooms: Room[] = [
  room("collection-kids", "cloud-kids-room", "غرفة كلاود", "تكوين لطيف بدرجات محايدة، سرير آمن ووحدات تخزين سهلة الوصول.", 28500, 4, "/demo/room-kids-cloud.webp", "/demo/room-kids-oak.webp", 1),
  room("collection-kids", "oak-kids-room", "غرفة أوك الصغيرة", "خشب طبيعي فاتح مع تفاصيل عملية ومكتب مدمج للمذاكرة.", 31900, 7, "/demo/room-kids-oak.webp", "/demo/room-kids-cloud.webp", 2),
  room("collection-master", "linen-master-room", "غرفة لينن", "قماش كتاني هادئ، ظهر سرير عريض وإضاءة جانبية تمنح الغرفة دفئاً ناعماً.", 49800, 2, "/demo/room-master-linen.webp", "/demo/room-master-walnut.webp", 1),
  room("collection-master", "walnut-master-room", "غرفة وولنت", "قشرة جوز دافئة وخطوط مستقيمة لمساحة نوم عملية وفخمة بهدوء.", 55750, 5, "/demo/room-master-walnut.webp", "/demo/room-master-linen.webp", 2),
  room("collection-salons", "classic-salon", "صالون رويال", "تنجيد فاتح وتفاصيل كلاسيكية مخففة تناسب الاستقبال العصري.", 46500, 0, "/demo/room-salon-classic.webp", "/demo/room-salon-olive.webp", 1),
  room("collection-salons", "olive-salon", "صالون أوليف", "لون زيتوني مطفأ مع أخشاب داكنة وتكوين مفتوح ومريح.", 43200, 8, "/demo/room-salon-olive.webp", "/demo/room-salon-classic.webp", 2),
  room("collection-dining", "marble-dining", "سفرة ماربل", "سطح رخامي هادئ مع ستة مقاعد مريحة وتفاصيل معدنية بسيطة.", 38900, 3, "/demo/room-dining-marble.webp", "/demo/room-dining-oak.webp", 1),
  room("collection-dining", "oak-dining", "سفرة أوك", "طاولة خشب طبيعي بملمس واضح ومقاعد منسوجة للاستخدام اليومي.", 34200, 9, "/demo/room-dining-oak.webp", "/demo/room-dining-marble.webp", 2),
  room("collection-living", "sand-living", "انتريه ساند", "درجات رملية ووسائد عميقة تناسب الجلسات الطويلة وتفتح المساحة بصرياً.", 36700, 12, "/demo/room-living-sand.webp", "/demo/room-living-navy.webp", 1),
  room("collection-living", "navy-living", "انتريه نيفي", "أزرق عميق مع أرجل خشبية خفيفة وشخصية واضحة دون ازدحام.", 39400, 1, "/demo/room-living-navy.webp", "/demo/room-living-sand.webp", 2),
  room("collection-sectional", "warm-sectional", "ركنة وورم", "ركنة واسعة بلون دافئ، شازلونج مريح ونسب مناسبة لغرفة المعيشة.", 41200, 6, "/demo/room-sectional-warm.webp", "/demo/room-sectional-graphite.webp", 1),
  room("collection-sectional", "graphite-sectional", "ركنة جرافيت", "قماش رمادي عملي وتكوين مرن للمساحات الكبيرة والمتوسطة.", 43800, 4, "/demo/room-sectional-graphite.webp", "/demo/room-sectional-warm.webp", 2),
];

for (const item of demoRooms) {
  const collection = demoCollections.find((candidate) => candidate.id === item.collectionId);
  if (collection) {
    item.collection = {
      id: collection.id,
      slug: collection.slug,
      nameAr: collection.nameAr,
      nameEn: collection.nameEn,
    };
  }
}

