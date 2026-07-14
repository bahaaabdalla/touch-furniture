import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import type { Activity } from "@/types/catalog";
import { getCatalogRepository } from "@/lib/catalog/repository";
import { Preloader } from "./preloader";

function formatLocalPhone(whatsapp: string) {
  // "201145085454" -> "01145085454"
  const digits = whatsapp.replace(/\D/g, "");
  return digits.startsWith("20") ? "0" + digits.slice(2) : digits;
}

export async function CatalogFrame({
  activity,
  children,
}: {
  activity: Activity;
  children: ReactNode;
}) {
  const style = {
    "--accent-primary": activity.settings.accentPrimary,
    "--accent-secondary": activity.settings.accentSecondary,
  } as CSSProperties;

  const collections = await (await getCatalogRepository()).getCollections();
  const phone = formatLocalPhone(activity.settings.whatsappNumber);

  return (
    <div style={style} className="min-h-screen">
      <Preloader nameEn={activity.nameEn} />

      <header className="z-40 border-b hairline bg-ivory/85 backdrop-blur sm:sticky sm:top-0">
        {/* Row 1 — brand + contact, compact */}
        <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-4 px-5 py-2.5 sm:px-8 lg:px-12">
          <Link href="/" className="focus-ring flex flex-col rounded-sm leading-none" aria-label="تاتش فرنتشر — الرئيسية">
            <span className="brand-name text-2xl text-ink sm:text-3xl">تاتش فِرنتشر</span>
            <span className="latin-display text-[.7rem] uppercase tracking-[.34em] text-gold sm:text-xs">
              {activity.nameEn}
            </span>
          </Link>

          <div className="flex items-center gap-4 text-left">
            <a
              href={`tel:+${activity.settings.whatsappNumber}`}
              className="focus-ring inline-flex items-center gap-1.5 rounded-sm text-[.8rem] font-bold text-ink transition-colors hover:text-accent sm:text-sm"
              dir="ltr"
              aria-label={`اتصال: ${phone}`}
            >
              <span aria-hidden="true">☎</span> {phone}
            </a>
            <span className="hidden h-6 w-px bg-[var(--line)] lg:block" aria-hidden="true" />
            <span className="hidden max-w-xs text-xs leading-5 text-muted lg:block">
              {activity.settings.addressAr}
            </span>
          </div>
        </div>

        {/* Row 2 — primary links, then category tabs (2 per row on mobile, inline on desktop) */}
        <div className="border-t hairline bg-paper/40">
          <div className="mx-auto max-w-[1480px] px-5 py-2 sm:px-8 lg:px-12">
            <div className="flex items-center gap-4 text-sm font-bold">
              <Link
                href="/#about"
                className="focus-ring rounded-sm transition-colors hover:text-accent"
              >
                من نحن
              </Link>
              <Link
                href="/#contact"
                className="focus-ring rounded-sm transition-colors hover:text-accent"
              >
                تواصل معنا
              </Link>
            </div>
            <ul className="mt-2 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2.5">
              {collections.map((collection) => (
                <li key={collection.id}>
                  <Link
                    href={`/collections/${collection.slug}`}
                    className="cat-chip kufi-display focus-ring flex w-full items-center justify-center rounded-full px-3 py-1.5 text-[.8rem] text-ink sm:w-auto sm:px-4 sm:text-sm"
                  >
                    {collection.nameAr}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer id="contact" className="mt-24 border-t hairline bg-paper/55">
        <div className="mx-auto grid max-w-[1480px] gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_auto] lg:px-12">
          <div>
            <p className="brand-name text-2xl text-ink">تاتش فِرنتشر</p>
            <p className="latin-display mt-1 text-2xl text-accent">{activity.nameEn}</p>
            <a
              href={`tel:+${activity.settings.whatsappNumber}`}
              className="focus-ring mt-3 inline-block rounded-sm text-sm font-bold text-ink hover:text-accent"
              dir="ltr"
            >
              ☎ {phone}
            </a>
          </div>
          <address className="max-w-xl not-italic leading-8 text-muted lg:text-left">
            {activity.settings.addressAr}
          </address>
        </div>
        <p className="border-t hairline py-5 text-center text-xs text-muted">
          جميع الأسعار والكميات قابلة للتحديث من إدارة المعرض.
        </p>
      </footer>
    </div>
  );
}
