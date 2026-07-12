"use client";

import Image from "next/image";
import { useState } from "react";
import { processRawImage } from "@/app/admin/actions";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type ImageTarget = "collections" | "rooms" | "logo";

export function ImageUploadField({ name, label, target, initial = [], multiple = false }: { name: string; label: string; target: ImageTarget; initial?: string[]; multiple?: boolean }) {
  const [urls, setUrls] = useState(initial.filter(Boolean));
  const [status, setStatus] = useState("");

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setStatus("جارٍ تجهيز الصورة...");
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) throw new Error("انتهت جلسة الدخول.");
      const next = multiple ? [...urls] : [];
      for (const file of Array.from(files)) {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 15 * 1024 * 1024) throw new Error("اختر JPEG أو PNG أو WebP بحجم لا يتجاوز 15MB.");
        const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
        const rawPath = `${data.user.id}/${crypto.randomUUID()}.${extension}`;
        const result = await supabase.storage.from("catalog-raw").upload(rawPath, file, { contentType: file.type, upsert: false });
        if (result.error) throw new Error("تعذر رفع الصورة الخام.");
        next.push(await processRawImage(rawPath, target));
      }
      setUrls(next.slice(0, multiple ? 12 : 1));
      setStatus("تم تجهيز الصورة وحفظها.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "تعذر رفع الصورة.");
    }
  }

  const hiddenValue = multiple ? JSON.stringify(urls) : (urls[0] ?? "");
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">{label}</label>
      <input type="hidden" name={name} value={hiddenValue} />
      <input type="file" accept="image/jpeg,image/png,image/webp" multiple={multiple} onChange={(event) => upload(event.target.files)} className="block w-full rounded-lg border hairline bg-white p-3 text-sm file:ml-4 file:rounded-full file:border-0 file:bg-stone-100 file:px-4 file:py-2" />
      {status ? <p className="text-xs text-muted" role="status">{status}</p> : null}
      {urls.length ? <div className="flex flex-wrap gap-3">{urls.map((url, index) => <div key={url} className="relative"><Image src={url} alt="" width={150} height={105} className="h-24 w-36 rounded-md object-cover" /><button type="button" onClick={() => setUrls((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="absolute -left-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-red-700 text-white" aria-label="حذف الصورة">×</button></div>)}</div> : null}
    </div>
  );
}
