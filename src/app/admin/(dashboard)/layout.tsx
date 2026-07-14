import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/supabase/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="mx-auto min-h-screen max-w-[1480px] lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="border-b hairline bg-white/70 p-6 lg:min-h-screen lg:border-b-0 lg:border-l">
        <Link href="/admin" className="block"><span className="latin-display text-2xl text-gold">Touch Furniture</span><span className="mt-1 block text-sm text-muted">إدارة الكتالوج</span></Link>
        <nav className="mt-8 flex gap-2 overflow-x-auto lg:flex-col">
          {[['/admin','نظرة عامة'],['/admin/collections','المجموعات'],['/admin/rooms','الغرف والمخزون'],['/admin/settings','الإعدادات']].map(([href,label]) => <Link key={href} href={href} className="whitespace-nowrap rounded-xl px-4 py-3 text-sm transition hover:bg-stone-100">{label}</Link>)}
        </nav>
        <div className="mt-8 flex items-center gap-3 lg:mt-16 lg:flex-col lg:items-stretch">
          <Link href="/" target="_blank" rel="noopener noreferrer" className="rounded-full border hairline px-4 py-2 text-center text-sm transition hover:bg-stone-100">↗ عرض الكتالوج</Link>
          <form action={logoutAction} className="w-full">
            <button className="w-full rounded-full border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100">⎋ تسجيل الخروج</button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 p-5 sm:p-8 lg:p-10">{children}</main>
    </div>
  );
}

