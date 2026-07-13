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
      <section className="mx-auto grid max-w-[1480px] items-center gap-10 px-5 pb-14 pt-10 sm:px-8 lg:grid-cols-[.78fr_1.22fr] lg:px-12">
        <div className="relative z-10 lg:pl-10">
          <p className="latin-display text-xl tracking-[.22em] text-gold">TOUCH FURNITURE</p>
          <h1 className="mt-5 max-w-xl text-balance text-4xl font-extrabold leading-[1.22] sm:text-6xl">
            أثاث له حضور، وبيت يشبهك.
          </h1>
          <p className="mt-5 max-w-lg text-base font-medium leading-8 text-muted sm:mt-6 sm:text-lg sm:leading-9">
            تصفّح مجموعاتنا ككتالوج مفتوح؛ تفاصيل هادئة، خامات عملية، واختيارات مرتبة لتصل إلى غرفتك بسهولة.
          </p>
          <Link
            href="#collections"
            className="focus-ring mt-8 inline-flex items-center gap-4 rounded-full border hairline bg-paper/65 px-7 py-3.5 font-bold transition hover:border-accent hover:bg-paper"
          >
            اكتشف المجموعات <span aria-hidden="true">←</span>
          </Link>
        </div>
        <div className="relative min-h-[420px] overflow-hidden sm:min-h-[560px] lg:min-h-[640px]">
          <Image
            src={hero}
            alt="مجموعة أثاث من تاتش فرنتشر"
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          <p className="absolute bottom-6 right-6 rounded-full bg-paper/90 px-5 py-2 text-sm font-bold backdrop-blur">
            كتالوج 2026
          </p>
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
