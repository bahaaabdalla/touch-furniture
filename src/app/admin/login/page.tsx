import { loginAction } from "@/app/admin/actions";
import { ErrorBanner } from "@/components/admin/error-banner";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 soft-shadow sm:p-10">
        <p className="latin-display text-2xl text-gold">Touch Furniture</p>
        <h1 className="mt-2 text-3xl font-medium">دخول الإدارة</h1>
        <p className="mt-3 text-sm leading-7 text-muted">هذه المساحة مخصصة لحسابات الإدارة المدعوة فقط.</p>
        <div className="mt-7"><ErrorBanner message={error} /></div>
        <form action={loginAction} className="space-y-5">
          <label className="block space-y-2"><span className="text-sm">البريد الإلكتروني</span><input type="email" name="email" required autoComplete="email" dir="ltr" className="w-full rounded-xl border hairline px-4 py-3 outline-none focus:border-accent" /></label>
          <label className="block space-y-2"><span className="text-sm">كلمة المرور</span><input type="password" name="password" required minLength={8} autoComplete="current-password" dir="ltr" className="w-full rounded-xl border hairline px-4 py-3 outline-none focus:border-accent" /></label>
          <button className="w-full rounded-full bg-ink px-6 py-3 text-white">دخول</button>
        </form>
      </div>
    </main>
  );
}

