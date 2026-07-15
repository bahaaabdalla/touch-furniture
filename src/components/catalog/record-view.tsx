"use client";

import { useEffect } from "react";

const KEY = "touch-furniture:recent:v1";

export function RecordView({
  id,
  slug,
  nameAr,
  coverUrl,
  price,
  currency,
}: {
  id: string;
  slug: string;
  nameAr: string;
  coverUrl: string;
  price: number;
  currency: string;
}) {
  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem(KEY) ?? "[]") as { id: string }[];
      const entry = { id, slug, nameAr, coverUrl, price, currency };
      const next = [entry, ...list.filter((item) => item.id !== id)].slice(0, 12);
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // ignore storage errors
    }
  }, [id, slug, nameAr, coverUrl, price, currency]);

  return null;
}
