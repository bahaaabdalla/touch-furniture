import { z } from "zod";

const optionalUrl = z.union([z.literal(""), z.string().url(), z.string().startsWith("/")]);
const slug = z.string().trim().min(2).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "استخدم حروفاً إنجليزية صغيرة وشرطات فقط.");
const color = z.string().regex(/^#[0-9a-fA-F]{6}$/, "لون HEX غير صالح.");

export const loginSchema = z.object({ email: z.email(), password: z.string().min(8).max(200) });

export const collectionSchema = z.object({
  id: z.string().uuid().optional(),
  slug,
  nameAr: z.string().trim().min(2).max(120),
  nameEn: z.string().trim().min(2).max(120),
  descriptionAr: z.string().trim().min(4).max(1200),
  coverUrl: optionalUrl,
  sortOrder: z.coerce.number().int().min(0).max(10000).optional(),
  isPublished: z.boolean(),
});

export const roomSchema = z.object({
  id: z.string().uuid().optional(),
  collectionId: z.string().uuid(),
  slug,
  nameAr: z.string().trim().min(2).max(120),
  descriptionAr: z.string().trim().min(4).max(2400),
  price: z.coerce.number().min(0).max(100_000_000),
  currency: z.string().trim().min(1).max(20),
  stock: z.coerce.number().int().min(0).max(1_000_000),
  coverUrl: optionalUrl,
  galleryUrls: z.array(optionalUrl).max(12),
  sortOrder: z.coerce.number().int().min(0).max(10000).optional(),
  isPublished: z.boolean(),
});

export const settingsSchema = z.object({
  activityId: z.string().uuid(),
  nameAr: z.string().trim().min(2).max(120),
  nameEn: z.string().trim().min(2).max(120),
  logoUrl: optionalUrl,
  whatsappNumber: z.string().regex(/^\d{10,15}$/, "اكتب الرقم الدولي بالأرقام فقط."),
  addressAr: z.string().trim().min(5).max(500),
  accentPrimary: color,
  accentSecondary: color,
});

export function checkbox(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

export function stringValue(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

