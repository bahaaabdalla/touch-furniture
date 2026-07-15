import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogFrame } from "@/components/catalog/catalog-frame";
import { FavoriteButton } from "@/components/catalog/favorite-button";
import { RecordView } from "@/components/catalog/record-view";
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
      <RecordView id={room.id} slug={room.slug} nameAr={room.nameAr} coverUrl={room.coverUrl} price={room.price} currency={room.currency} />
      <section className="mx-auto max-w-[1480px] px-5 pb-28 pt-8 sm:px-8 sm:pb-16 lg:px-12">
        <Link href={room.collection ? `/collections/${room.collection.slug}` : "/"} className="focus-ring text-sm text-muted hover:text-ink">العودة إلى {room.collection?.nameAr ?? "الكتالوج"}</Link>
        <div className="mt-6 grid grid-cols-1 gap-8 sm:mt-9 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:items-start lg:gap-12">
          <div className="min-w-0"><RoomGallery images={[room.coverUrl, ...room.galleryUrls]} name={room.nameAr} /></div>
          <aside className="min-w-0 lg:sticky lg:top-8">
            <p className="latin-display text-lg text-gold sm:text-xl">{room.collection?.nameEn ?? "Touch Collection"}</p>
            <h1 className="kufi-display mt-2 text-balance break-words text-3xl leading-tight sm:mt-3 sm:text-6xl">{room.nameAr}</h1>
            <p className="mt-5 text-2xl font-medium text-accent sm:mt-6">{formatPrice(room.price, room.currency)}</p>
            <div className="mt-5 sm:mt-6"><StockStatus stock={room.stock} /></div>
            <div className="mt-7 border-y hairline py-7 sm:mt-9 sm:py-8"><p className="whitespace-pre-line text-base leading-8 text-muted sm:text-lg sm:leading-9">{room.descriptionAr}</p></div>
            <div className="mt-7 hidden flex-wrap items-center gap-4 sm:mt-8 sm:flex"><WhatsAppButton number={activity.settings.whatsappNumber} /><FavoriteButton roomId={room.id} /></div>
            <p className="mt-5 hidden text-xs leading-6 text-muted sm:block">سيرسل واتساب رابط هذه الغرفة مباشرة حتى يسهل الرجوع إليها.</p>
          </aside>
        </div>
      </section>

      {/* Mobile: always-reachable inquiry bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t hairline bg-ivory/95 px-4 py-3 backdrop-blur sm:hidden">
        <div className="flex items-center gap-3">
          <FavoriteButton roomId={room.id} />
          <WhatsAppButton number={activity.settings.whatsappNumber} className="flex-1" />
        </div>
      </div>
    </CatalogFrame>
  );
}
