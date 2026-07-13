import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogFrame } from "@/components/catalog/catalog-frame";
import { FavoriteButton } from "@/components/catalog/favorite-button";
import { RoomGallery } from "@/components/catalog/room-gallery";
import { StockStatus } from "@/components/catalog/stock-status";
import { WhatsAppButton } from "@/components/catalog/whatsapp-button";
import { formatPrice } from "@/lib/catalog/format";
import { demoRooms } from "@/lib/catalog/demo-data";
import { getCatalogRepository } from "@/lib/catalog/repository";

export function generateStaticParams() {
  return demoRooms.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const room = await (await getCatalogRepository()).getRoomBySlug(slug);
  return room ? { title: room.nameAr, description: room.descriptionAr, openGraph: { images: [room.coverUrl] } } : {};
}

export default async function RoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const repository = await getCatalogRepository();
  const [activity, room] = await Promise.all([repository.getActivity(), repository.getRoomBySlug(slug)]);
  if (!room) notFound();
  return (
    <CatalogFrame activity={activity}>
      <section className="mx-auto max-w-[1480px] px-5 pb-16 pt-8 sm:px-8 lg:px-12">
        <Link href={room.collection ? `/collections/${room.collection.slug}` : "/"} className="focus-ring text-sm text-muted hover:text-ink">العودة إلى {room.collection?.nameAr ?? "الكتالوج"}</Link>
        <div className="mt-9 grid gap-12 lg:grid-cols-[1.35fr_.65fr] lg:items-start">
          <RoomGallery images={[room.coverUrl, ...room.galleryUrls]} name={room.nameAr} />
          <aside className="lg:sticky lg:top-8">
            <p className="latin-display text-xl text-gold">{room.collection?.nameEn ?? "Touch Collection"}</p>
            <h1 className="kufi-display mt-3 text-5xl leading-tight sm:text-6xl">{room.nameAr}</h1>
            <p className="mt-6 text-2xl font-medium text-accent">{formatPrice(room.price, room.currency)}</p>
            <div className="mt-6"><StockStatus stock={room.stock} /></div>
            <div className="mt-9 border-y hairline py-8"><p className="whitespace-pre-line text-lg leading-9 text-muted">{room.descriptionAr}</p></div>
            <div className="mt-8 flex flex-wrap items-center gap-4"><WhatsAppButton number={activity.settings.whatsappNumber} /><FavoriteButton roomId={room.id} /></div>
            <p className="mt-5 text-xs leading-6 text-muted">سيرسل واتساب رابط هذه الغرفة مباشرة حتى يسهل الرجوع إليها.</p>
          </aside>
        </div>
      </section>
    </CatalogFrame>
  );
}
