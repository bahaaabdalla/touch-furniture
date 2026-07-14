import Image from "next/image";
import Link from "next/link";
import { CatalogFrame } from "@/components/catalog/catalog-frame";
import { getCatalogRepository } from "@/lib/catalog/repository";

export default async function HomePage() {
  const repository = await getCatalogRepository();
  const [activity, collections] = await Promise.all([
    repository.getActivity(),
    repository.getCollections(),
  ]);
  const hero = collections[0]?.coverUrl ?? "/demo/collection-master.webp";

  return (
    <CatalogFrame activity={activity}>
      <section className="mx-auto max-w-[1480px] px-5 pt-6 sm:px-8 lg:px-12">
        <div className="cover-frame">
          <div className="relative aspect-[16/9] min-h-[220px] overflow-hidden bg-stone-200 sm:aspect-[21/8]">
            <Image
              src={hero}
              alt="مجموعة أثاث من تاتش فرنتشر"
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/25 to-transparent" />
            <div className="absolute inset-y-0 right-0 flex max-w-md flex-col justify-center gap-3 p-6 text-right sm:p-10 lg:p-14">
              <p className="latin-display text-xs tracking-[.28em] text-white/85 sm:text-sm">TOUCH FURNITURE</p>
              <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-4xl">
                أثاث له حضور، وبيت يشبهك.
              </h1>
              <p className="hidden max-w-sm text-sm leading-7 text-white/85 sm:block">
                تصفّح مجموعاتنا ككتالوج مفتوح؛ تفاصيل هادئة واختيارات مرتبة.
              </p>
              <Link
                href="#collections"
                className="focus-ring mt-1 inline-flex w-fit items-center gap-3 rounded-full bg-paper/95 px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-paper"
              >
                اكتشف المجموعات <span aria-hidden="true">←</span>
              </Link>
            </div>
            <p className="absolute bottom-4 left-4 rounded-full bg-paper/90 px-4 py-1.5 text-xs font-bold backdrop-blur">
              كتالوج 2026
            </p>
          </div>
        </div>
      </section>

      <section id="collections" className="mx-auto max-w-[1480px] px-5 py-16 sm:px-8 lg:px-12">
        <div className="mb-12 flex items-end justify-between gap-8 border-b hairline pb-7">
          <div>
            <p className="text-sm font-bold tracking-[.18em] text-gold">المجموعات</p>
            <h2 className="kufi-display mt-2 text-4xl sm:text-5xl">اختر المساحة</h2>
          </div>
          <p className="latin-display hidden text-2xl text-muted sm:block">Curated for everyday living</p>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2">
          {collections.map((collection) => (
            <article key={collection.id} className="group">
              <Link
                href={`/collections/${collection.slug}`}
                className="focus-ring block"
                aria-label={collection.nameAr}
              >
                <div className="cover-frame">
                  <div className="relative aspect-[16/10] overflow-hidden bg-stone-200">
                    <Image
                      src={collection.coverUrl}
                      alt={collection.nameAr}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-70 transition group-hover:opacity-90" />
                    <span className="absolute bottom-4 right-4 rounded-full bg-paper/90 px-4 py-1.5 text-sm font-bold">
                      عرض المجموعة
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <h3 className="kufi-display text-2xl sm:text-3xl">{collection.nameAr}</h3>
                  <p className="latin-display text-lg text-gold">{collection.nameEn}</p>
                </div>
                <p className="mt-2 leading-7 text-muted">{collection.descriptionAr}</p>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="mx-auto max-w-[1480px] px-5 pb-8 sm:px-8 lg:px-12">
        <div className="grid gap-8 border-t hairline pt-14 lg:grid-cols-[auto_1fr] lg:gap-16">
          <div>
            <p className="text-sm font-bold tracking-[.18em] text-gold">من نحن</p>
            <h2 className="kufi-display mt-2 text-3xl sm:text-4xl">تاتش فِرنتشر</h2>
          </div>
          <p className="max-w-3xl text-lg font-medium leading-9 text-muted">
            معرض متخصّص في الأثاث المنزلي بكفر الدوار، نختار لكل مساحة قطعاً بخامات عملية وتشطيب
            نظيف — من غرف الأطفال وغرف النوم إلى الصالونات والسفرة والانتريهات والركن. نعرض
            مجموعاتنا ككتالوج مرتّب يسهّل عليك الاختيار، وأي قطعة تعجبك تقدر تتواصل معنا بشأنها
            مباشرة عبر واتساب.
          </p>
        </div>
      </section>
    </CatalogFrame>
  );
}
