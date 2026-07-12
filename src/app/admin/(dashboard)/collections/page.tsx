import Link from "next/link";
import { deleteCollection } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { ErrorBanner } from "@/components/admin/error-banner";
import { requireAdmin } from "@/lib/supabase/auth";

export default async function CollectionsAdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [{ supabase }, params] = await Promise.all([requireAdmin(), searchParams]);
  const { data } = await supabase.from("collections").select("id, name_ar, name_en, slug, sort_order, is_published").order("sort_order");
  return <div><div className="flex items-end justify-between gap-5"><div><p className="text-sm text-gold">المحتوى</p><h1 className="mt-2 text-4xl">المجموعات</h1></div><Link href="/admin/collections/new" className="rounded-full bg-ink px-6 py-3 text-white">مجموعة جديدة</Link></div><div className="mt-7"><ErrorBanner message={params.error} /></div><div className="mt-5 overflow-x-auto rounded-2xl bg-white soft-shadow"><table className="w-full min-w-[700px] text-right"><thead className="border-b hairline text-sm text-muted"><tr><th className="p-5">الاسم</th><th className="p-5">الرابط</th><th className="p-5">الترتيب</th><th className="p-5">الحالة</th><th className="p-5">الإجراءات</th></tr></thead><tbody className="divide-y hairline">{(data ?? []).map((item) => <tr key={item.id}><td className="p-5 font-medium">{item.name_ar}<span className="latin-display mr-2 text-muted">{item.name_en}</span></td><td className="p-5 text-sm text-muted" dir="ltr">{item.slug}</td><td className="p-5">{item.sort_order}</td><td className="p-5">{item.is_published ? "منشورة" : "مسودة"}</td><td className="p-5"><div className="flex gap-3"><Link href={`/admin/collections/${item.id}`} className="rounded-full border hairline px-4 py-2 text-sm">تعديل</Link><form action={deleteCollection}><input type="hidden" name="id" value={item.id} /><ConfirmButton message="سيتم حذف المجموعة وكل الغرف داخلها. هل أنت متأكد؟">حذف</ConfirmButton></form></div></td></tr>)}</tbody></table></div></div>;
}

