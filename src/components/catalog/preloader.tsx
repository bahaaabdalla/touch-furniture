"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const KEY = "touch-furniture:intro-seen:v1";

export function Preloader() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(KEY)) return;
    sessionStorage.setItem(KEY, "1");
    const revealTimer = window.setTimeout(() => setVisible(true), 0);
    const timer = window.setTimeout(() => setVisible(false), reduceMotion ? 120 : 950);
    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(timer);
    };
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-[#f7f1e8]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.38 }}
          aria-hidden="true"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.48, ease: "easeOut" }}
            className="relative w-48"
          >
            <div className="absolute inset-8 rounded-full bg-gold/30 blur-3xl" />
            <Image src="/brand/touch-logo.svg" width={900} height={260} alt="" priority className="relative h-auto w-full" />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
