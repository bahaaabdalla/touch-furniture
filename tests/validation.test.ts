import { describe, expect, it } from "vitest";
import { collectionSchema, settingsSchema } from "@/lib/validation/admin";

describe("admin validation", () => {
  it("rejects unsafe slugs", () => {
    const result = collectionSchema.safeParse({ slug: "../غرفة", nameAr: "غرفة نوم", nameEn: "Bedroom", descriptionAr: "وصف صالح للمجموعة", coverUrl: "", sortOrder: 1, isPublished: true });
    expect(result.success).toBe(false);
  });

  it("requires international digits and safe colors", () => {
    const result = settingsSchema.safeParse({ activityId: "10000000-0000-4000-8000-000000000001", nameAr: "تاتش فرنتشر", nameEn: "Touch Furniture", logoUrl: "/brand/touch-logo.svg", whatsappNumber: "+2011", addressAr: "عنوان صالح للاختبار", accentPrimary: "red", accentSecondary: "#b18b57" });
    expect(result.success).toBe(false);
  });
});

