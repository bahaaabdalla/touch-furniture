import { createClient } from "@supabase/supabase-js";
import type {
  Activity,
  ActivitySettings,
  CatalogRepository,
  Collection,
  Room,
} from "@/types/catalog";
import { requireSupabaseEnvironment } from "./mode";

type JsonRecord = Record<string, unknown>;

function publicClient() {
  const { url, key } = requireSupabaseEnvironment();
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function value<T>(row: JsonRecord, key: string, fallback: T): T {
  return (row[key] as T | undefined) ?? fallback;
}

function mapSettings(row: JsonRecord | null, activityId: string): ActivitySettings {
  return {
    activityId,
    whatsappNumber: value(row ?? {}, "whatsapp_number", "201145085454"),
    addressAr: value(row ?? {}, "address_ar", ""),
    accentPrimary: value(row ?? {}, "accent_primary", "#6d4c3d"),
    accentSecondary: value(row ?? {}, "accent_secondary", "#b18b57"),
  };
}

function mapActivity(row: JsonRecord): Activity {
  const relation = row.activity_settings;
  const settings = Array.isArray(relation) ? relation[0] : relation;
  const id = value(row, "id", "");
  return {
    id,
    slug: value(row, "slug", ""),
    nameAr: value(row, "name_ar", ""),
    nameEn: value(row, "name_en", ""),
    type: value(row, "type", "furniture"),
    logoUrl: value(row, "logo_url", "/brand/touch-logo.svg"),
    isPublished: value(row, "is_published", false),
    settings: mapSettings((settings as JsonRecord | undefined) ?? null, id),
  };
}

function mapCollection(row: JsonRecord): Collection {
  return {
    id: value(row, "id", ""),
    activityId: value(row, "activity_id", ""),
    slug: value(row, "slug", ""),
    nameAr: value(row, "name_ar", ""),
    nameEn: value(row, "name_en", ""),
    descriptionAr: value(row, "description_ar", ""),
    coverUrl: value(row, "cover_url", ""),
    sortOrder: value(row, "sort_order", 0),
    isPublished: value(row, "is_published", false),
  };
}

function mapRoom(row: JsonRecord): Room {
  const relation = row.collections;
  const collectionRow = (Array.isArray(relation) ? relation[0] : relation) as JsonRecord | undefined;
  return {
    id: value(row, "id", ""),
    collectionId: value(row, "collection_id", ""),
    slug: value(row, "slug", ""),
    nameAr: value(row, "name_ar", ""),
    descriptionAr: value(row, "description_ar", ""),
    price: Number(value(row, "price", 0)),
    currency: value(row, "currency", "ج.م"),
    stock: value(row, "stock", 0),
    coverUrl: value(row, "cover_url", ""),
    galleryUrls: value(row, "gallery_urls", []),
    sortOrder: value(row, "sort_order", 0),
    isPublished: value(row, "is_published", false),
    collection: collectionRow
      ? {
          id: value(collectionRow, "id", ""),
          slug: value(collectionRow, "slug", ""),
          nameAr: value(collectionRow, "name_ar", ""),
          nameEn: value(collectionRow, "name_en", ""),
        }
      : undefined,
  };
}

export class SupabaseCatalogRepository implements CatalogRepository {
  async getActivity() {
    const { data, error } = await publicClient()
      .from("activities")
      .select("*, activity_settings(*)")
      .eq("slug", "touch-furniture")
      .eq("is_published", true)
      .single();
    if (error || !data) throw new Error("تعذر تحميل بيانات المعرض.");
    return mapActivity(data as JsonRecord);
  }

  async getCollections() {
    const activity = await this.getActivity();
    const { data, error } = await publicClient()
      .from("collections")
      .select("*")
      .eq("activity_id", activity.id)
      .eq("is_published", true)
      .order("sort_order");
    if (error) throw new Error("تعذر تحميل المجموعات.");
    return (data ?? []).map((row) => mapCollection(row as JsonRecord));
  }

  async getCollectionBySlug(slug: string) {
    const { data, error } = await publicClient()
      .from("collections")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error("تعذر تحميل المجموعة.");
    if (!data) return null;
    const collection = mapCollection(data as JsonRecord);
    const rooms = await publicClient()
      .from("rooms")
      .select("*")
      .eq("collection_id", collection.id)
      .eq("is_published", true)
      .order("sort_order");
    if (rooms.error) throw new Error("تعذر تحميل الغرف.");
    return {
      ...collection,
      rooms: (rooms.data ?? []).map((row) => mapRoom(row as JsonRecord)),
    };
  }

  async getRoomBySlug(slug: string) {
    const { data, error } = await publicClient()
      .from("rooms")
      .select("*, collections(id, slug, name_ar, name_en)")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error("تعذر تحميل الغرفة.");
    return data ? mapRoom(data as JsonRecord) : null;
  }

  async getAllRooms() {
    const { data, error } = await publicClient()
      .from("rooms")
      .select("*, collections(id, slug, name_ar, name_en)")
      .eq("is_published", true)
      .order("sort_order");
    if (error) throw new Error("تعذر تحميل الغرف.");
    return (data ?? []).map((row) => mapRoom(row as JsonRecord));
  }
}

