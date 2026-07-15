"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { publicStoragePath } from "@/lib/catalog/format";
import { IMAGE_MIME_TYPES, processCatalogImage, processLogoImage } from "@/lib/images/pipeline";
import { requireAdmin } from "@/lib/supabase/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { checkbox, collectionSchema, loginSchema, roomSchema, settingsSchema, stringValue } from "@/lib/validation/admin";

type ImageTarget = "collections" | "rooms" | "logo";

function fail(destination: string, message: string): never {
  redirect(`${destination}?error=${encodeURIComponent(message)}`);
}

async function getActivityId() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("activities").select("id").eq("slug", "touch-furniture").single();
  if (error || !data) throw new Error("تعذر العثور على نشاط المعرض.");
  return String(data.id);
}

async function removeUrls(supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>, urls: string[]) {
  const paths = [...new Set(urls.map(publicStoragePath).filter((value): value is string => Boolean(value)))];
  if (paths.length) await supabase.storage.from("catalog-images").remove(paths);
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({ email: stringValue(formData, "email"), password: stringValue(formData, "password") });
  if (!parsed.success) fail("/admin/login", "تحقق من البريد وكلمة المرور.");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || data.user?.app_metadata?.role !== "admin") {
    await supabase.auth.signOut();
    fail("/admin/login", "بيانات الدخول غير صحيحة أو الحساب ليس مديراً.");
  }
  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function processRawImage(rawPath: string, target: ImageTarget) {
  const { supabase, claims } = await requireAdmin();
  if (!(["collections", "rooms", "logo"] as const).includes(target)) throw new Error("نوع صورة غير صالح.");
  if (!rawPath.startsWith(`${claims.sub}/`) || rawPath.includes("..")) throw new Error("مسار الرفع غير صالح.");

  const { data: raw, error: downloadError } = await supabase.storage.from("catalog-raw").download(rawPath);
  if (downloadError || !raw) throw new Error("تعذر قراءة الصورة الخام.");
  if (raw.type && !IMAGE_MIME_TYPES.has(raw.type)) throw new Error("نوع الصورة غير مسموح.");

  try {
    const input = Buffer.from(await raw.arrayBuffer());
    const activityId = await getActivityId();
    let output: Buffer;
    let extension: "png" | "webp";
    let contentType: "image/png" | "image/webp";

    if (target === "logo") {
      output = await processLogoImage(input);
      extension = "png";
      contentType = "image/png";
    } else {
      output = await processCatalogImage(input);
      extension = "webp";
      contentType = "image/webp";
    }

    const objectPath = `${activityId}/${target}/${randomUUID()}.${extension}`;
    // Sharp can return a Buffer backed by shared memory; the fetch layer rejects
    // that ("SharedArrayBuffer is not allowed"). Upload a plain Blob copy instead.
    const body = new Blob([new Uint8Array(output)], { type: contentType });
    const { error: uploadError } = await supabase.storage.from("catalog-images").upload(objectPath, body, {
      cacheControl: "31536000",
      contentType,
      upsert: false,
    });
    if (uploadError) {
      console.error("catalog-images upload failed", { objectPath, contentType, size: output.byteLength, error: uploadError });
      throw new Error(`تعذر حفظ الصورة المعالجة: ${uploadError.message ?? "unknown"}`);
    }
    return supabase.storage.from("catalog-images").getPublicUrl(objectPath).data.publicUrl;
  } finally {
    await supabase.storage.from("catalog-raw").remove([rawPath]);
  }
}

export async function saveCollection(formData: FormData) {
  const id = stringValue(formData, "id") || undefined;
  const destination = id ? `/admin/collections/${id}` : "/admin/collections/new";
  const parsed = collectionSchema.safeParse({
    id,
    slug: stringValue(formData, "slug"),
    nameAr: stringValue(formData, "name_ar"),
    nameEn: stringValue(formData, "name_en"),
    descriptionAr: stringValue(formData, "description_ar"),
    coverUrl: stringValue(formData, "cover_url"),
    sortOrder: stringValue(formData, "sort_order"),
    isPublished: checkbox(formData, "is_published"),
  });
  if (!parsed.success) fail(destination, parsed.error.issues[0]?.message ?? "بيانات غير صالحة.");

  const { supabase } = await requireAdmin();
  const activityId = await getActivityId();
  const payload = {
    activity_id: activityId,
    slug: parsed.data.slug,
    name_ar: parsed.data.nameAr,
    name_en: parsed.data.nameEn,
    description_ar: parsed.data.descriptionAr,
    cover_url: parsed.data.coverUrl,
    sort_order: parsed.data.sortOrder,
    is_published: parsed.data.isPublished,
  };
  let oldCover = "";
  if (id) {
    const old = await supabase.from("collections").select("cover_url").eq("id", id).single();
    oldCover = String(old.data?.cover_url ?? "");
  }
  const result = id
    ? await supabase.from("collections").update(payload).eq("id", id)
    : await supabase.from("collections").insert(payload);
  if (result.error) fail(destination, "تعذر حفظ المجموعة. تأكد أن الرابط المختصر غير مستخدم.");
  if (oldCover && oldCover !== parsed.data.coverUrl) await removeUrls(supabase, [oldCover]);
  revalidatePath("/", "layout");
  redirect("/admin/collections");
}

export async function deleteCollection(formData: FormData) {
  const id = stringValue(formData, "id");
  const { supabase } = await requireAdmin();
  const [collection, rooms] = await Promise.all([
    supabase.from("collections").select("cover_url").eq("id", id).single(),
    supabase.from("rooms").select("cover_url, gallery_urls").eq("collection_id", id),
  ]);
  const urls = [
    String(collection.data?.cover_url ?? ""),
    ...(rooms.data ?? []).flatMap((room) => [String(room.cover_url ?? ""), ...((room.gallery_urls as string[] | null) ?? [])]),
  ];
  const { error } = await supabase.from("collections").delete().eq("id", id);
  if (error) fail("/admin/collections", "تعذر حذف المجموعة.");
  await removeUrls(supabase, urls);
  revalidatePath("/", "layout");
  redirect("/admin/collections");
}

export async function saveRoom(formData: FormData) {
  const id = stringValue(formData, "id") || undefined;
  const destination = id ? `/admin/rooms/${id}` : "/admin/rooms/new";
  let galleryUrls: string[] = [];
  try { galleryUrls = JSON.parse(stringValue(formData, "gallery_urls") || "[]") as string[]; } catch { fail(destination, "قائمة صور غير صالحة."); }
  const parsed = roomSchema.safeParse({
    id,
    collectionId: stringValue(formData, "collection_id"),
    slug: stringValue(formData, "slug"),
    nameAr: stringValue(formData, "name_ar"),
    descriptionAr: stringValue(formData, "description_ar"),
    price: stringValue(formData, "price"),
    currency: stringValue(formData, "currency"),
    stock: stringValue(formData, "stock"),
    coverUrl: stringValue(formData, "cover_url"),
    galleryUrls,
    sortOrder: stringValue(formData, "sort_order"),
    isPublished: checkbox(formData, "is_published"),
  });
  if (!parsed.success) fail(destination, parsed.error.issues[0]?.message ?? "بيانات غير صالحة.");
  const { supabase } = await requireAdmin();
  const payload = {
    collection_id: parsed.data.collectionId,
    slug: parsed.data.slug,
    name_ar: parsed.data.nameAr,
    description_ar: parsed.data.descriptionAr,
    price: parsed.data.price,
    currency: parsed.data.currency,
    stock: parsed.data.stock,
    cover_url: parsed.data.coverUrl,
    gallery_urls: parsed.data.galleryUrls,
    sort_order: parsed.data.sortOrder,
    is_published: parsed.data.isPublished,
  };
  let oldUrls: string[] = [];
  if (id) {
    const old = await supabase.from("rooms").select("cover_url, gallery_urls").eq("id", id).single();
    oldUrls = [String(old.data?.cover_url ?? ""), ...((old.data?.gallery_urls as string[] | null) ?? [])];
  }
  const result = id ? await supabase.from("rooms").update(payload).eq("id", id) : await supabase.from("rooms").insert(payload);
  if (result.error) fail(destination, "تعذر حفظ الغرفة. تأكد أن الرابط المختصر غير مستخدم.");
  const retained = new Set([parsed.data.coverUrl, ...parsed.data.galleryUrls]);
  await removeUrls(supabase, oldUrls.filter((url) => !retained.has(url)));
  revalidatePath("/", "layout");
  redirect("/admin/rooms");
}

export async function updateStock(formData: FormData) {
  const id = stringValue(formData, "id");
  const stock = Number(stringValue(formData, "stock"));
  if (!Number.isInteger(stock) || stock < 0) fail("/admin/rooms", "كمية غير صالحة.");
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("rooms").update({ stock }).eq("id", id);
  if (error) fail("/admin/rooms", "تعذر تحديث المخزون.");
  revalidatePath("/", "layout");
  redirect("/admin/rooms");
}

export async function deleteRoom(formData: FormData) {
  const id = stringValue(formData, "id");
  const { supabase } = await requireAdmin();
  const old = await supabase.from("rooms").select("cover_url, gallery_urls").eq("id", id).single();
  const { error } = await supabase.from("rooms").delete().eq("id", id);
  if (error) fail("/admin/rooms", "تعذر حذف الغرفة.");
  await removeUrls(supabase, [String(old.data?.cover_url ?? ""), ...((old.data?.gallery_urls as string[] | null) ?? [])]);
  revalidatePath("/", "layout");
  redirect("/admin/rooms");
}

export async function saveSettings(formData: FormData) {
  const parsed = settingsSchema.safeParse({
    activityId: stringValue(formData, "activity_id"),
    nameAr: stringValue(formData, "name_ar"),
    nameEn: stringValue(formData, "name_en"),
    logoUrl: stringValue(formData, "logo_url"),
    whatsappNumber: stringValue(formData, "whatsapp_number"),
    addressAr: stringValue(formData, "address_ar"),
    accentPrimary: stringValue(formData, "accent_primary"),
    accentSecondary: stringValue(formData, "accent_secondary"),
  });
  if (!parsed.success) fail("/admin/settings", parsed.error.issues[0]?.message ?? "بيانات غير صالحة.");
  const { supabase } = await requireAdmin();
  const old = await supabase.from("activities").select("logo_url").eq("id", parsed.data.activityId).single();
  const activity = await supabase.from("activities").update({ name_ar: parsed.data.nameAr, name_en: parsed.data.nameEn, logo_url: parsed.data.logoUrl }).eq("id", parsed.data.activityId);
  const settings = await supabase.from("activity_settings").update({ whatsapp_number: parsed.data.whatsappNumber, address_ar: parsed.data.addressAr, accent_primary: parsed.data.accentPrimary, accent_secondary: parsed.data.accentSecondary }).eq("activity_id", parsed.data.activityId);
  if (activity.error || settings.error) fail("/admin/settings", "تعذر حفظ الإعدادات.");
  const oldLogo = String(old.data?.logo_url ?? "");
  if (oldLogo && oldLogo !== parsed.data.logoUrl) await removeUrls(supabase, [oldLogo]);
  revalidatePath("/", "layout");
  redirect("/admin/settings?saved=1");
}

