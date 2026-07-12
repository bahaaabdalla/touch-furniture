import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/auth";

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();
  const [collections, rooms, lowStock] = await Promise.all([
    supabase.from("collections").select("id", { count: "exact", head: true }),
    supabase.from("rooms").select("id", { count: "exact", head: true }),
    supabase.from("rooms").select("id, name_ar, stock").lt("stock", 5).order("stock").limit(8),
  ]);
  return (
    <div>
      <p className="text-sm tracking-[.16em] text-gold">لوحة الإدارة</p><h1 className="mt-2 text-4xl font-medium">نظرة عامة</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 soft-shadow"><p className="text-sm text-muted">المجموعات</p><p className="mt-3 text-4xl">{collections.count ?? 0}</p></div>
        <div className="rounded-2xl bg-white p-6 soft-shadow"><p className="text-sm text-muted">الغرف</p><p className="mt-3 text-4xl">{rooms.count ?? 0}</p></div>
        <div className="rounded-2xl bg-white p-6 soft-shadow"><p className="text-sm text-muted">مخزون منخفض</p><p className="mt-3 text-4xl text-red-700">{lowStock.data?.length ?? 0}</p></div>
      </div>
      <section className="mt-8 rounded-2xl bg-white p-6 soft-shadow"><div className="flex items-center justify-between"><h2 className="text-xl font-medium">تنبيهات المخزون</h2><Link href="/admin/rooms" className="text-sm text-accent">إدارة الغرف</Link></div>{lowStock.data?.length ? <ul className="mt-5 divide-y hairline">{lowStock.data.map((room) => <li key={room.id} className="flex justify-between py-4"><span>{room.name_ar}</span><span className="text-red-700">{room.stock === 0 ? "نفذت" : `${room.stock} قطع`}</span></li>)}</ul> : <p className="mt-5 text-muted">لا توجد تنبيهات حالياً.</p>}</section>
    </div>
  );
}

