"use server";

import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseEnvironment } from "@/lib/catalog/mode";

const schema = z.object({
  phone: z.string().trim().regex(/^[0-9+]{8,20}$/, "اكتب رقم هاتف صحيح."),
  rooms: z
    .array(z.object({ id: z.string().uuid(), name: z.string().trim().min(1).max(200) }))
    .min(1, "أضف غرفة واحدة على الأقل إلى المفضلة.")
    .max(60),
});

export async function submitInterest(input: { phone: string; rooms: { id: string; name: string }[] }) {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة." };
  }
  try {
    const { url, key } = requireSupabaseEnvironment();
    const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const rows = parsed.data.rooms.map((room) => ({
      phone: parsed.data.phone,
      room_id: room.id,
      room_name: room.name,
    }));
    const { error } = await supabase.from("interests").insert(rows);
    if (error) return { ok: false as const, error: "تعذر حفظ اهتمامك، حاول مرة أخرى." };
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "الخدمة غير متاحة حالياً." };
  }
}
