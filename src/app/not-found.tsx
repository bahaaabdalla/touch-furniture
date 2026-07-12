import Link from "next/link";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center px-5 text-center"><div><p className="latin-display text-7xl text-gold">404</p><h1 className="mt-4 text-3xl">الصفحة غير موجودة</h1><Link href="/" className="focus-ring mt-7 inline-block rounded-full border hairline bg-paper px-6 py-3">العودة للكتالوج</Link></div></main>;
}
