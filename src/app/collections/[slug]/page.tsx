import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogFrame } from "@/components/catalog/catalog-frame";
import { CatalogSpread } from "@/components/catalog/catalog-spread";
import { demoCollections } from "@/lib/catalog/demo-data";
import { getCatalogRepository } from "@/lib/catalog/repository";

export function generateStaticParams() {
  return demoCollections.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collection = await (await getCatalogRepository()).getCollectionBySlug(slug);
  return collection ? { title: collection.nameAr, description: collection.descriptionAr } : {};
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const repository = await getCatalogRepository();
  const [activity, collection] = await Promise.all([repository.getActivity(), repository.getCollectionBySlug(slug)]);
  if (!collection) notFound();
  return (
    <CatalogFrame activity={activity}>
      <section className="mx-auto max-w-[1380px] px-5 pb-12 pt-12 sm:px-8 lg:px-12">
        <Link href="/" className="focus-ring text-sm text-muted hover:text-ink">العودة إلى المجموعات</Link>
        <div className="mt-10 grid items-end gap-8 border-b hairline pb-10 lg:grid-cols-[1fr_auto]">
          <div><p className="latin-display text-xl text-gold">{collection.nameEn}</p><h1 className="mt-3 text-5xl font-light sm:text-7xl">{collection.nameAr}</h1></div>
          <p className="max-w-xl leading-8 text-muted">{collection.descriptionAr}</p>
        </div>
      </section>
      {collection.rooms.length ? <CatalogSpread rooms={collection.rooms} /> : <p className="py-24 text-center text-muted">لا توجد غرف منشورة في هذه المجموعة بعد.</p>}
    </CatalogFrame>
  );
}
