import Link from "next/link";
import { saveCollection } from "@/app/admin/actions";
import { ImageUploadField } from "./image-upload-field";

type CollectionValue = { id?: string; slug?: string; name_ar?: string; name_en?: string; description_ar?: string; cover_url?: string; sort_order?: number; is_published?: boolean };

export function CollectionForm({ value = {} }: { value?: CollectionValue }) {
  const input = "w-full rounded-xl border hairline bg-white px-4 py-3 outline-none transition focus:border-accent";
  return (
    <form action={saveCollection} className="space-y-6">
      {value.id ? <input type="hidden" name="id" value={value.id} /> : null}
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="space-y-2"><span className="text-sm font-medium">الاسم العربي</span><input className={input} name="name_ar" defaultValue={value.name_ar} required maxLength={120} /></label>
        <label className="space-y-2"><span className="text-sm font-medium">الاسم الإنجليزي</span><input className={input} name="name_en" defaultValue={value.name_en} required maxLength={120} dir="ltr" /></label>
      </div>
      <label className="block space-y-2"><span className="text-sm font-medium">الرابط المختصر</span><input className={input} name="slug" defaultValue={value.slug} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" dir="ltr" placeholder="master-bedrooms" /></label>
      <label className="block space-y-2"><span className="text-sm font-medium">الوصف</span><textarea className={`${input} min-h-32 resize-y`} name="description_ar" defaultValue={value.description_ar} required maxLength={1200} /></label>
      <ImageUploadField name="cover_url" label="صورة الغلاف" target="collections" initial={value.cover_url ? [value.cover_url] : []} />
      <div className="grid items-end gap-6 sm:grid-cols-2">
        <label className="space-y-2"><span className="text-sm font-medium">الترتيب</span><input className={input} type="number" name="sort_order" defaultValue={value.sort_order ?? 0} min={0} required /></label>
        <label className="flex items-center gap-3 rounded-xl border hairline bg-white px-4 py-3"><input type="checkbox" name="is_published" defaultChecked={value.is_published ?? true} className="h-5 w-5 accent-[var(--accent-primary)]" /> منشورة</label>
      </div>
      <div className="flex gap-3 border-t hairline pt-6"><button className="rounded-full bg-ink px-7 py-3 text-white">حفظ المجموعة</button><Link href="/admin/collections" className="rounded-full border hairline px-7 py-3">إلغاء</Link></div>
    </form>
  );
}

