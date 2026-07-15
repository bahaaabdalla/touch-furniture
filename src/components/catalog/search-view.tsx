"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatPrice } from "@/lib/catalog/format";
import type { Room } from "@/types/catalog";

const RECENT_KEY = "touch-furniture:recent:v1";

type RecentItem = { id: string; slug: string; nameAr: string; coverUrl: string; price: number; currency: string };

function RoomCard({ slug, nameAr, coverUrl, price, currency }: RecentItem) {
  return (
    <Link href={`/rooms/${slug}`} className="focus-ring group page-shadow block overflow-hidden rounded-2xl bg-paper">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
        <Image src={coverUrl} alt={nameAr} fill sizes="(max-width: 640px) 92vw, 30vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" />
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <h3 className="min-w-0 break-words text-lg font-medium">{nameAr}</h3>
        <p className="whitespace-nowrap font-bold text-accent">{formatPrice(price, currency)}</p>
      </div>
    </Link>
  );
}

export function SearchView({ rooms }: { rooms: Room[] }) {
  const [q, setQ] = useState("");
  const [recent, setRecent] = useState<RecentItem[]>([]);

  useEffect(() => {
    try {
      setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]") as RecentItem[]);
    } catch {
      setRecent([]);
    }
  }, []);

  const results = useMemo(() => {
    const term = q.trim();
    if (!term) return [];
    return rooms.filter(
      (room) => room.nameAr.includes(term) || (room.collection?.nameAr ?? "").includes(term),
    );
  }, [q, rooms]);

  return (
    <section className="mx-auto max-w-[1380px] px-5 pb-24 pt-10 sm:px-8 sm:pb-16 lg:px-12">
      <p className="text-sm font-bold tracking-[.18em] text-gold">البحث</p>
      <h1 className="kufi-display mt-2 text-3xl sm:text-5xl">دوّر على غرفتك</h1>

      <div className="mt-6">
        <input
          type="search"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="اكتب اسم الغرفة أو القسم..."
          className="w-full rounded-full border hairline bg-white px-6 py-3.5 text-lg outline-none focus:border-accent"
          autoFocus
        />
      </div>

      {q.trim() ? (
        results.length ? (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((room) => (
              <RoomCard key={room.id} id={room.id} slug={room.slug} nameAr={room.nameAr} coverUrl={room.coverUrl} price={room.price} currency={room.currency} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center text-muted">مفيش نتائج للبحث «{q}».</p>
        )
      ) : recent.length ? (
        <div className="mt-10">
          <h2 className="kufi-display mb-5 text-2xl">شوهدت مؤخراً</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((item) => (
              <RoomCard key={item.id} {...item} />
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-10 text-center text-muted">ابدأ الكتابة للبحث في كل الغرف.</p>
      )}
    </section>
  );
}
