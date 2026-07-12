"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const STORAGE_KEY = "touch-furniture:favorites:v1";

export function FavoriteButton({ roomId }: { roomId: string }) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
      setFavorite(saved.includes(roomId));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [roomId]);

  function toggle() {
    const saved = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[]);
    if (saved.has(roomId)) saved.delete(roomId); else saved.add(roomId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...saved]));
    setFavorite(saved.has(roomId));
  }

  return (
    <motion.button
      type="button"
      onClick={toggle}
      whileTap={{ scale: 0.86 }}
      aria-pressed={favorite}
      aria-label={favorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
      className={`focus-ring grid h-12 w-12 place-items-center rounded-full border hairline transition-colors ${favorite ? "bg-red-50 text-red-600" : "bg-paper text-muted hover:text-red-600"}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill={favorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
      </svg>
    </motion.button>
  );
}
