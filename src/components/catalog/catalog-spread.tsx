"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/catalog/format";
import type { Room } from "@/types/catalog";
import { StockStatus } from "./stock-status";

export function CatalogSpread({ rooms }: { rooms: Room[] }) {
  return (
    <div className="mx-auto flex max-w-[1380px] snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-10 sm:px-8 lg:grid lg:grid-cols-2 lg:gap-px lg:overflow-visible lg:px-12">
      {rooms.map((room, index) => (
        <motion.article key={room.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.2) }} className="page-shadow min-w-[88vw] snap-center bg-paper p-4 sm:min-w-[65vw] sm:p-7 lg:min-w-0 lg:p-9">
          <Link href={`/rooms/${room.slug}`} className="focus-ring group block">
            <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
              <Image src={room.coverUrl} alt={room.nameAr} fill sizes="(max-width: 1024px) 88vw, 44vw" className="object-cover transition duration-700 group-hover:scale-[1.025]" />
            </div>
            <div className="flex items-start justify-between gap-5 pt-6">
              <div>
                <h2 className="text-2xl font-medium sm:text-3xl">{room.nameAr}</h2>
                <p className="latin-display mt-1 text-lg text-muted">No. {String(index + 1).padStart(2, "0")}</p>
              </div>
              <p className="whitespace-nowrap text-lg font-medium text-accent">{formatPrice(room.price, room.currency)}</p>
            </div>
            <div className="mt-5 border-t hairline pt-4"><StockStatus stock={room.stock} compact /></div>
          </Link>
        </motion.article>
      ))}
    </div>
  );
}

