import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Activity } from "@/types/catalog";
import { Preloader } from "./preloader";

export function CatalogFrame({ activity, children }: { activity: Activity; children: ReactNode }) {
  const style = {
    "--accent-primary": activity.settings.accentPrimary,
    "--accent-secondary": activity.settings.accentSecondary,
  } as CSSProperties;

  return (
    <div style={style} className="min-h-screen">
      <Preloader />
      <header className="mx-auto flex w-full max-w-[1480px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-sm" aria-label="العودة إلى الرئيسية">
          <Image src={activity.logoUrl} alt={activity.nameAr} width={190} height={58} priority className="h-12 w-auto sm:h-14" />
        </Link>
        <nav className="flex items-center gap-5 text-sm text-muted sm:gap-8">
          <Link className="focus-ring rounded-sm transition-colors hover:text-ink" href="/#collections">المجموعات</Link>
          <Link className="focus-ring rounded-sm transition-colors hover:text-ink" href="/#contact">تواصل معنا</Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer id="contact" className="mt-24 border-t hairline bg-paper/55">
        <div className="mx-auto grid max-w-[1480px] gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_auto] lg:px-12">
          <div>
            <p className="text-xl font-medium">{activity.nameAr}</p>
            <p className="latin-display mt-1 text-2xl text-accent">{activity.nameEn}</p>
          </div>
          <address className="max-w-xl not-italic leading-8 text-muted lg:text-left">{activity.settings.addressAr}</address>
        </div>
        <p className="border-t hairline py-5 text-center text-xs text-muted">جميع الأسعار والكميات قابلة للتحديث من إدارة المعرض.</p>
      </footer>
    </div>
  );
}

