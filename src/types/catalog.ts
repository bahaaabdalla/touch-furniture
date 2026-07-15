export type ActivityType = "furniture" | "restaurant" | "retail" | "other";

export interface ActivitySettings {
  activityId: string;
  whatsappNumber: string;
  addressAr: string;
  accentPrimary: string;
  accentSecondary: string;
}

export interface Activity {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  type: ActivityType;
  logoUrl: string;
  isPublished: boolean;
  settings: ActivitySettings;
}

export interface Collection {
  id: string;
  activityId: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  coverUrl: string;
  sortOrder: number;
  isPublished: boolean;
}

export interface Room {
  id: string;
  collectionId: string;
  slug: string;
  nameAr: string;
  descriptionAr: string;
  price: number;
  currency: string;
  stock: number;
  coverUrl: string;
  galleryUrls: string[];
  sortOrder: number;
  isPublished: boolean;
  collection?: Pick<Collection, "id" | "slug" | "nameAr" | "nameEn">;
}

export interface CollectionWithRooms extends Collection {
  rooms: Room[];
}

export interface CatalogRepository {
  getActivity(): Promise<Activity>;
  getCollections(): Promise<Collection[]>;
  getCollectionBySlug(slug: string): Promise<CollectionWithRooms | null>;
  getRoomBySlug(slug: string): Promise<Room | null>;
  getAllRooms(): Promise<Room[]>;
}

