"use client";

import { buildWhatsAppUrl } from "@/lib/catalog/format";

export function WhatsAppButton({ number }: { number: string }) {
  function openWhatsApp() {
    const url = buildWhatsAppUrl(number, window.location.href);
    window.open(url, "_blank", "noopener,noreferrer");
  }
  return (
    <button type="button" onClick={openWhatsApp} className="focus-ring inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#1f6e4a] px-7 font-medium text-white shadow-lg shadow-emerald-900/10 transition hover:-translate-y-0.5 hover:bg-[#185c3d]">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.5L3 20.6l1.3-4.7a8.5 8.5 0 1 1 16.2-4.1Z"/><path d="M8.2 7.8c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.8 1.9c.1.3.1.5-.1.7l-.6.7c-.2.2-.1.5 0 .7.8 1.4 1.9 2.4 3.4 3 .3.1.5.1.7-.1l.8-1c.2-.2.4-.3.7-.1l2 .9c.3.1.4.3.4.5 0 .6-.3 1.7-1.1 2.2-.7.5-1.7.8-3.1.4-1.2-.3-2.8-1-4.7-2.7-1.5-1.4-2.6-3-3-4.2-.5-1.4 0-2.4.4-2.9Z"/></svg>
      اسأل عبر واتساب
    </button>
  );
}

