"use client";

import Image from "next/image";
import { useState } from "react";

export function RoomGallery({ images, name }: { images: string[]; name: string }) {
  const unique = [...new Set(images.filter(Boolean))];
  const [active, setActive] = useState(unique[0]);
  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-200 soft-shadow">
        <Image src={active} alt={name} fill priority sizes="(max-width: 1024px) 100vw, 62vw" className="object-cover" />
      </div>
      {unique.length > 1 ? (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {unique.map((image, index) => (
            <button key={image} type="button" onClick={() => setActive(image)} aria-label={`عرض الصورة ${index + 1}`} className={`focus-ring relative h-20 w-28 shrink-0 overflow-hidden rounded-sm border-2 ${active === image ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"}`}>
              <Image src={image} alt="" fill sizes="112px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

