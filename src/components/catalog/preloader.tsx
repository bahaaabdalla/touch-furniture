"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const KEY = "touch-furniture:intro-seen:v2";

export function Preloader({ nameEn = "TOUCH FURNITURE" }: { nameEn?: string }) {
  // Hidden by default. Only the very first page view in a browser session shows
  // the intro; internal navigation (opening a collection/room) never re-triggers
  // it, so there's no flash or "freeze" feel while browsing.
  const [visible, setVisible] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    // Already shown this session → never show again (prevents the navigation flash).
    if (sessionStorage.getItem(KEY)) return;

    const prefersReduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    setReduce(Boolean(prefersReduce));
    sessionStorage.setItem(KEY, "1");
    setVisible(true);

    const hold = prefersReduce ? 200 : 1500;
    const timer = window.setTimeout(() => setVisible(false), hold);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-ivory/85 px-6 backdrop-blur-2xl"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.42 }}
          aria-hidden="true"
        >
          <div className="relative flex w-full max-w-full flex-col items-center text-center">
            <span
              className="absolute -inset-x-8 -inset-y-6 rounded-full bg-gold/25 blur-3xl"
              aria-hidden="true"
            />
            <span
              className={`brand-name relative block w-full whitespace-nowrap text-[2rem] leading-tight text-ink sm:text-7xl ${
                reduce ? "" : "brand-glow"
              }`}
              lang="ar"
              dir="rtl"
            >
              تَاتْش فِرْنِتْشَر
            </span>
            <span className="latin-display relative mt-2 text-base uppercase tracking-[.3em] text-gold sm:mt-3 sm:text-3xl sm:tracking-[.42em]">
              {nameEn}
            </span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
