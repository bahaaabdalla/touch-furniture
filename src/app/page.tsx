import Image from "next/image";
import Link from "next/link";
import { CatalogFrame } from "@/components/catalog/catalog-frame";
import { getCatalogRepository } from "@/lib/catalog/repository";

export default async function HomePage() {
  const repository = await getCatalogRepository();
  const [activity, collections] = await Promise.all([repository.getActivity(), repository.getCollections()]);
  const hero = collections[0]?.coverUrl ?? "/demo/collection-master.webp";

  return (
    <CatalogFrame activity={activity}>
      <section className="mx-auto grid min-h-[76vh] max-w-[1480px] items-center gap-10 px-5 pb-16 pt-8 sm:px-8 lg:grid-cols-[.78fr_1.22fr] lg:px-12">
        <div className="relative z-10 lg:pl-10">
          <p className="latin-display text-xl tracking-[.22em] text-gold">TOUCH FURNITURE</p>
          <h1 className="mt-6 max-w-xl text-balance text-5xl font-light leading-[1.28] sm:text-7xl">أثاث له حضور، وبيت يشبهك.</h1>
          <p className="mt-7 max-w-lg text-lg leading-9 text-muted">تصفّح مجموعاتنا ككتالوج مفتوح؛ تفاصيل هادئة، خامات عملية، واختيارات مرتبة لتصل إلى غرفتك بسهولة.</p>
          <Link href="#collections" className="focus-ring mt-9 inline-flex items-center gap-4 rounded-full border hairline bg-paper/65 px-7 py-3.5 font-medium transition hover:border-accent hover:bg-paper">اكتشف المجموعات <span aria-hidden="true">←</span></Link>
        </div>
        <div className="relative min-h-[440px] overflow-hidden sm:min-h-[620px] lg:min-h-[700px]">
          <Image src={hero} alt="مجموعة أثاث من تاتش فرنتشر" fill priority fetchPriority="high" sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          <p className="absolute bottom-6 right-6 rounded-full bg-paper/90 px-5 py-2 text-sm backdrop-blur">كتالوج 2026</p>
        </div>
      </section>

      <section id="collections" className="mx-auto max-w-[1480px] px-5 py-20 sm:px-8 lg:px-12">
        <div className="mb-16 flex items-end justify-between gap-8 border-b hairline pb-8">
          <div><p className="text-sm tracking-[.18em] text-gold">المجموعات</p><h2 className="mt-3 text-4xl font-light sm:text-6xl">اختر المساحة</h2></div>
          <p className="latin-display hidden text-2xl text-muted sm:block">Curated for everyday living</p>
        </div>
        <div className="space-y-20 lg:space-y-28">
          {collections.map((collection, index) => (
            <article key={collection.id} className={`grid items-center gap-8 lg:grid-cols-12 ${index % 2 ? "" : "lg:text-left"}`}>
              <Link href={`/collections/${collection.slug}`} className={`focus-ring group relative block aspect-[16/10] overflow-hidden bg-stone-200 soft-shadow lg:col-span-8 ${index % 2 ? "lg:col-start-5 lg:row-start-1" : ""}`}>
                <Image src={collection.coverUrl} alt={collection.nameAr} fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover transition duration-700 group-hover:scale-[1.025]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-70 transition group-hover:opacity-90" />
                <span className="absolute bottom-5 right-5 rounded-full bg-paper/90 px-5 py-2 text-sm">عرض المجموعة</span>
              </Link>
              <div className={`lg:col-span-4 ${index % 2 ? "lg:col-start-1 lg:row-start-1 lg:pr-8" : "lg:pl-8"}`}>
                <p className="latin-display text-xl text-gold">{collection.nameEn}</p>
                <h3 className="mt-3 text-4xl font-light sm:text-5xl">{collection.nameAr}</h3>
                <p className="mt-5 leading-8 text-muted">{collection.descriptionAr}</p>
                <Link href={`/collections/${collection.slug}`} className="focus-ring mt-7 inline-flex border-b border-accent/40 pb-1 text-accent">افتح الكتالوج</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </CatalogFrame>
  );
}
