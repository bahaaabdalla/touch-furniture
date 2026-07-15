import type { CatalogRepository } from "@/types/catalog";
import { demoActivity, demoCollections, demoRooms } from "./demo-data";

export const demoRepository: CatalogRepository = {
  async getActivity() {
    return demoActivity;
  },
  async getCollections() {
    return [...demoCollections].sort((a, b) => a.sortOrder - b.sortOrder);
  },
  async getCollectionBySlug(slug) {
    const collection = demoCollections.find((item) => item.slug === slug);
    if (!collection) return null;
    return {
      ...collection,
      rooms: demoRooms
        .filter((item) => item.collectionId === collection.id)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    };
  },
  async getRoomBySlug(slug) {
    return demoRooms.find((item) => item.slug === slug) ?? null;
  },
  async getAllRooms() {
    return [...demoRooms].sort((a, b) => a.sortOrder - b.sortOrder);
  },
};

