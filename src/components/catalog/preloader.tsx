"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const KEY = "touch-furniture:intro-seen:v2";

export function Preloader({ nameEn = "TOUCH FURNITURE" }: { nameEn?: string }) {
  // Start visible so the intro is guaranteed to paint on a fresh load.
  const [visible, setVisible] = useState(true);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const prefersReduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    setReduce(Boolean(prefersReduce));

    // Already shown this browser session → skip immediately, no flash held.
    if (sessionStorage.getItem(KEY)) {
      setVisible(false);
      return;
    }
    sessionStorage.setItem(KEY, "1");

    const hold = prefersReduce ? 200 : 1150;
    const timer = window.setTimeout(() => setVisible(false), hold);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-[#f7f1e8]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.42 }}
          aria-hidden="true"
        >
          <div className="relative flex flex-col items-center px-8 text-center">
            <span
              className="absolute -inset-x-10 -inset-y-6 rounded-full bg-gold/20 blur-3xl"
              aria-hidden="true"
            />
            <span
              className={`brand-name relative text-[2.75rem] leading-tight text-ink sm:text-7xl ${
                reduce ? "" : "brand-glow"
              }`}
              lang="ar"
              dir="rtl"
            >
              تَاتْش فِرْنِتْشَر
            </span>
            <span className="latin-display relative mt-2 text-xl uppercase tracking-[.34em] text-gold sm:mt-3 sm:text-3xl sm:tracking-[.42em]">
              {nameEn}
            </span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
