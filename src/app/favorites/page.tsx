import type { Metadata } from "next";
import { CatalogFrame } from "@/components/catalog/catalog-frame";
import { FavoritesView } from "@/components/catalog/favorites-view";
import { getCatalogRepository } from "@/lib/catalog/repository";

export const metadata: Metadata = { title: "المفضلة" };

export default async function FavoritesPage() {
  const repository = await getCatalogRepository();
  const [activity, rooms] = await Promise.all([repository.getActivity(), repository.getAllRooms()]);
  return (
    <CatalogFrame activity={activity}>
      <FavoritesView rooms={rooms} whatsapp={activity.settings.whatsappNumber} />
    </CatalogFrame>
  );
}
