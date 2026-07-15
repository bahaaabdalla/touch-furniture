import type { Metadata } from "next";
import { CatalogFrame } from "@/components/catalog/catalog-frame";
import { SearchView } from "@/components/catalog/search-view";
import { getCatalogRepository } from "@/lib/catalog/repository";

export const metadata: Metadata = { title: "بحث" };

export default async function SearchPage() {
  const repository = await getCatalogRepository();
  const [activity, rooms] = await Promise.all([repository.getActivity(), repository.getAllRooms()]);
  return (
    <CatalogFrame activity={activity}>
      <SearchView rooms={rooms} />
    </CatalogFrame>
  );
}
