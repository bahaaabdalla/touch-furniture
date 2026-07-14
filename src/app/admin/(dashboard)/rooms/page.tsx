import Link from "next/link";
import { deleteRoom, updateStock } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { ErrorBanner } from "@/components/admin/error-banner";
import { requireAdmin } from "@/lib/supabase/auth";

type RoomRow = {
  id: string;
  name_ar: string;
  slug: string;
  stock: number;
  price: number;
  currency: string;
  is_published: boolean;
  collections: { name_ar?: string } | { name_ar?: string }[] | null;
};

function collectionName(relation: RoomRow["collections"]) {
  return Array.isArray(relation) ? relation[0]?.name_ar : relation?.name_ar;
}

export default async function RoomsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ supabase }, query] = await Promise.all([requireAdmin(), searchParams]);
  const { data } = await supabase
    .from("rooms")
    .select("id, name_ar, slug, stock, price, currency, is_published, collections(name_ar)")
    .order("sort_order");
  const rooms = (data ?? []) as unknown as RoomRow[];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-gold">المحتوى</p>
          <h1 className="mt-2 text-3xl sm:text-4xl">الغرف والمخزون</h1>
        </div>
        <Link href="/admin/rooms/new" className="rounded-full bg-ink px-6 py-3 text-sm text-white sm:text-base">
          + غرفة جديدة
        </Link>
      </div>

      <div className="mt-7">
        <ErrorBanner message={query.error} />
      </div>

      {/* Mobile: stacked cards */}
      <div className="mt-5 space-y-4 lg:hidden">
        {rooms.map((item) => (
          <div key={item.id} className="rounded-2xl bg-white p-5 soft-shadow">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-bold">{item.name_ar}</p>
                <p className="text-xs text-muted" dir="ltr">{item.slug}</p>
                <p className="mt-1 text-sm text-muted">{collectionName(item.collections)}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs ${item.is_published ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-muted"}`}>
                {item.is_published ? "منشورة" : "مسودة"}
              </span>
            </div>
            <p className="mt-3 text-lg font-bold text-accent">
              {Number(item.price).toLocaleString("ar-EG")} {item.currency}
            </p>
            <form action={updateStock} className="mt-3 flex items-center gap-2">
              <input type="hidden" name="id" value={item.id} />
              <span className="text-sm text-muted">المخزون:</span>
              <input type="number" name="stock" min={0} defaultValue={item.stock} className="w-20 rounded-lg border hairline px-3 py-2" />
              <button className="rounded-full bg-ink px-4 py-2 text-sm text-white">تحديث</button>
            </form>
            <div className="mt-4 flex gap-3 border-t hairline pt-4">
              <Link href={`/admin/rooms/${item.id}`} className="flex-1 rounded-full border hairline py-2 text-center text-sm">تعديل</Link>
              <form action={deleteRoom} className="flex-1">
                <input type="hidden" name="id" value={item.id} />
                <ConfirmButton message="هل تريد حذف هذه الغرفة وصورها؟" className="w-full">حذف</ConfirmButton>
              </form>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="mt-5 hidden overflow-x-auto rounded-2xl bg-white soft-shadow lg:block">
        <table className="w-full text-right">
          <thead className="border-b hairline text-sm text-muted">
            <tr>
              <th className="p-5">الغرفة</th>
              <th className="p-5">المجموعة</th>
              <th className="p-5">السعر</th>
              <th className="p-5">المخزون</th>
              <th className="p-5">الحالة</th>
              <th className="p-5">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y hairline">
            {rooms.map((item) => (
              <tr key={item.id}>
                <td className="p-5 font-medium">
                  {item.name_ar}
                  <span className="block text-xs text-muted" dir="ltr">{item.slug}</span>
                </td>
                <td className="p-5">{collectionName(item.collections)}</td>
                <td className="p-5">{Number(item.price).toLocaleString("ar-EG")} {item.currency}</td>
                <td className="p-5">
                  <form action={updateStock} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={item.id} />
                    <input type="number" name="stock" min={0} defaultValue={item.stock} className="w-20 rounded-lg border hairline px-3 py-2" />
                    <button className="rounded-full bg-ink px-4 py-1.5 text-sm text-white">تحديث</button>
                  </form>
                </td>
                <td className="p-5">{item.is_published ? "منشورة" : "مسودة"}</td>
                <td className="p-5">
                  <div className="flex gap-3">
                    <Link href={`/admin/rooms/${item.id}`} className="rounded-full border hairline px-4 py-2 text-sm">تعديل</Link>
                    <form action={deleteRoom}>
                      <input type="hidden" name="id" value={item.id} />
                      <ConfirmButton message="هل تريد حذف هذه الغرفة وصورها؟">حذف</ConfirmButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
