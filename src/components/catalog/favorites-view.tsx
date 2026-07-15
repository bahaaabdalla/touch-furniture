"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { submitInterest } from "@/app/favorites/actions";
import { formatPrice } from "@/lib/catalog/format";
import type { Room } from "@/types/catalog";

const STORAGE_KEY = "touch-furniture:favorites:v1";

export function FavoritesView({ rooms }: { rooms: Room[]; whatsapp: string }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      setIds(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[]);
    } catch {
      setIds([]);
    }
    setReady(true);
  }, []);

  const favorites = useMemo(() => rooms.filter((room) => ids.includes(room.id)), [rooms, ids]);

  function remove(id: string) {
    const next = ids.filter((value) => value !== id);
    setIds(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  async function save() {
    if (!/^[0-9+]{8,20}$/.test(phone.trim())) {
      setStatus("error");
      setMessage("اكتب رقم هاتف صحيح.");
      return;
    }
    setStatus("saving");
    const result = await submitInterest({
      phone: phone.trim(),
      rooms: favorites.map((room) => ({ id: room.id, name: room.nameAr })),
    });
    if (result.ok) {
      setStatus("done");
      setMessage("تم تسجيل اهتمامك! هنتواصل معك بأحدث العروض على الغرف دي.");
    } else {
      setStatus("error");
      setMessage(result.error);
    }
  }

  return (
    <section className="mx-auto max-w-[1380px] px-5 pb-24 pt-10 sm:px-8 sm:pb-16 lg:px-12">
      <p className="text-sm font-bold tracking-[.18em] text-gold">المفضلة</p>
      <h1 className="kufi-display mt-2 text-3xl sm:text-5xl">الغرف اللي عجبتك</h1>

      {ready && favorites.length === 0 ? (
        <div className="mt-10 rounded-2xl border hairline bg-paper/60 p-10 text-center">
          <p className="text-lg text-muted">لسه مضفتش أي غرفة للمفضلة.</p>
          <Link href="/#collections" className="focus-ring mt-6 inline-block rounded-full bg-ink px-6 py-3 text-white">
            تصفّح المجموعات
          </Link>
        </div>
      ) : null}

      {favorites.length > 0 ? (
        <>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((room) => (
              <article key={room.id} className="page-shadow relative overflow-hidden rounded-2xl bg-paper">
                <button
                  type="button"
                  onClick={() => remove(room.id)}
                  aria-label="إزالة من المفضلة"
                  className="focus-ring absolute left-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-paper/90 text-red-600 shadow"
                >
                  ×
                </button>
                <Link href={`/rooms/${room.slug}`} className="focus-ring group block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
                    <Image src={room.coverUrl} alt={room.nameAr} fill sizes="(max-width: 640px) 92vw, 30vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" />
                  </div>
                  <div className="flex items-center justify-between gap-3 p-4">
                    <h2 className="min-w-0 break-words text-lg font-medium">{room.nameAr}</h2>
                    <p className="whitespace-nowrap font-bold text-accent">{formatPrice(room.price, room.currency)}</p>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border hairline bg-paper p-6 sm:p-8">
            <h2 className="kufi-display text-2xl">عايز عروض على الغرف دي؟</h2>
            <p className="mt-2 text-muted">سجّل رقمك وهنتواصل معك بأحدث الأسعار والعروض على مختاراتك.</p>
            {status === "done" ? (
              <p className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800">{message}</p>
            ) : (
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <input
                  type="tel"
                  inputMode="tel"
                  dir="ltr"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="01xxxxxxxxx"
                  className="w-full rounded-xl border hairline bg-white px-4 py-3 outline-none focus:border-accent sm:flex-1"
                />
                <button
                  type="button"
                  onClick={save}
                  disabled={status === "saving"}
                  className="rounded-full bg-ink px-7 py-3 font-medium text-white disabled:opacity-60"
                >
                  {status === "saving" ? "جارٍ الحفظ..." : "سجّل اهتمامي"}
                </button>
              </div>
            )}
            {status === "error" ? <p className="mt-3 text-sm text-red-600">{message}</p> : null}
            <p className="mt-3 text-xs text-muted">رقمك بيُستخدم للتواصل بخصوص الغرف اللي اخترتها فقط.</p>
          </div>
        </>
      ) : null}
    </section>
  );
}
