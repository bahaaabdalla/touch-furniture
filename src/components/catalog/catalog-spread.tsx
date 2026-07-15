"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/catalog/format";
import type { Room } from "@/types/catalog";
import { StockStatus } from "./stock-status";

type SortKey = "default" | "newest" | "price-asc" | "price-desc";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "default", label: "الافتراضي" },
  { key: "newest", label: "الأحدث" },
  { key: "price-asc", label: "السعر: الأقل أولاً" },
  { key: "price-desc", label: "السعر: الأعلى أولاً" },
];

export function CatalogSpread({ rooms }: { rooms: Room[] }) {
  const [sort, setSort] = useState<SortKey>("default");

  // Client-side ordering over the existing rooms — no data is changed.
  const sorted = useMemo(() => {
    const arr = [...rooms];
    if (sort === "newest") arr.sort((a, b) => b.sortOrder - a.sortOrder);
    else if (sort === "price-asc") arr.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") arr.sort((a, b) => b.price - a.price);
    return arr;
  }, [rooms, sort]);

  return (
    <div className="mx-auto max-w-[1380px] px-5 pb-10 sm:px-8 lg:px-12">
      <div className="no-scrollbar mb-6 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
        <span className="shrink-0 text-sm text-muted">ترتيب:</span>
        {SORTS.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setSort(option.key)}
            className={`focus-ring shrink-0 rounded-full border px-4 py-1.5 text-sm transition ${
              sort === option.key
                ? "border-accent bg-accent text-white"
                : "hairline bg-paper text-ink hover:border-accent"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-px">
        {sorted.map((room, index) => (
          <article key={room.id} className="page-shadow bg-paper p-3 sm:p-7 lg:p-9">
            <Link href={`/rooms/${room.slug}`} className="focus-ring group block">
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
                <Image
                  src={room.coverUrl}
                  alt={room.nameAr}
                  fill
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 44vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.025]"
                />
              </div>
              <div className="flex items-start justify-between gap-3 pt-3 sm:gap-5 sm:pt-6">
                <div>
                  <h2 className="text-lg font-medium leading-snug sm:text-3xl">{room.nameAr}</h2>
                  <p className="latin-display mt-0.5 text-sm text-muted sm:mt-1 sm:text-lg">No. {String(index + 1).padStart(2, "0")}</p>
                </div>
                <p className="whitespace-nowrap text-base font-bold text-accent sm:text-lg sm:font-medium">{formatPrice(room.price, room.currency)}</p>
              </div>
              <div className="mt-3 border-t hairline pt-3 sm:mt-5 sm:pt-4"><StockStatus stock={room.stock} compact /></div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
