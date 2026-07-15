import Link from "next/link";
import { saveRoom } from "@/app/admin/actions";
import { ImageUploadField } from "./image-upload-field";

type CollectionOption = { id: string; name_ar: string };
type RoomValue = { id?: string; collection_id?: string; slug?: string; name_ar?: string; description_ar?: string; price?: number | string; currency?: string; stock?: number; cover_url?: string; gallery_urls?: string[]; sort_order?: number; is_published?: boolean };

export function RoomForm({ collections, value = {} }: { collections: CollectionOption[]; value?: RoomValue }) {
  const input = "w-full rounded-xl border hairline bg-white px-4 py-3 outline-none transition focus:border-accent";
  return (
    <form action={saveRoom} className="space-y-6">
      {value.id ? <input type="hidden" name="id" value={value.id} /> : null}
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="space-y-2"><span className="text-sm font-medium">اسم الغرفة</span><input className={input} name="name_ar" defaultValue={value.name_ar} required maxLength={120} /></label>
        <label className="space-y-2"><span className="text-sm font-medium">المجموعة</span><select className={input} name="collection_id" defaultValue={value.collection_id} required><option value="">اختر المجموعة</option>{collections.map((item) => <option key={item.id} value={item.id}>{item.name_ar}</option>)}</select></label>
      </div>
      <label className="block space-y-2"><span className="text-sm font-medium">الرابط المختصر</span><input className={input} name="slug" defaultValue={value.slug} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" dir="ltr" placeholder="linen-master-room" /></label>
      <label className="block space-y-2"><span className="text-sm font-medium">الوصف</span><textarea className={`${input} min-h-36 resize-y`} name="description_ar" defaultValue={value.description_ar} required maxLength={2400} /></label>
      <div className="grid gap-6 sm:grid-cols-3">
        <label className="space-y-2"><span className="text-sm font-medium">السعر</span><input className={input} type="number" name="price" defaultValue={value.price ?? 0} min={0} step="0.01" required /></label>
        <label className="space-y-2"><span className="text-sm font-medium">العملة</span><input className={input} name="currency" defaultValue={value.currency ?? "ج.م"} required maxLength={20} /></label>
        <label className="space-y-2"><span className="text-sm font-medium">المخزون</span><input className={input} type="number" name="stock" defaultValue={value.stock ?? 0} min={0} required /></label>
      </div>
      <ImageUploadField name="cover_url" label="صورة الغلاف" target="rooms" initial={value.cover_url ? [value.cover_url] : []} />
      <ImageUploadField name="gallery_urls" label="صور المعرض — حتى 12 صورة" target="rooms" initial={value.gallery_urls ?? []} multiple />
      <div className="grid items-end gap-6 sm:grid-cols-2">
        {value.id ? (
          <label className="space-y-2"><span className="text-sm font-medium">الترتيب</span><input className={input} type="number" name="sort_order" defaultValue={value.sort_order ?? 0} min={0} /></label>
        ) : null}
        <label className="flex items-center gap-3 rounded-xl border hairline bg-white px-4 py-3"><input type="checkbox" name="is_published" defaultChecked={value.is_published ?? true} className="h-5 w-5 accent-[var(--accent-primary)]" /> منشورة</label>
      </div>
      <div className="flex gap-3 border-t hairline pt-6"><button className="rounded-full bg-ink px-7 py-3 text-white">حفظ الغرفة</button><Link href="/admin/rooms" className="rounded-full border hairline px-7 py-3">إلغاء</Link></div>
    </form>
  );
}

