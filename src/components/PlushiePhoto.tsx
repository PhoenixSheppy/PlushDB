"use client";

import type { CSSProperties } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FAVORITE_TRAIT } from "@/lib/traits";
import "@/lib/fontawesome";

const RISING_HEARTS = [
  { delay: "0s", drift: "-10px", left: "30%", size: "h-3.5 w-3.5" },
  { delay: "0.3s", drift: "0px", left: "50%", size: "h-4 w-4" },
  { delay: "0.6s", drift: "10px", left: "70%", size: "h-3.5 w-3.5" },
  { delay: "0.9s", drift: "-5px", left: "40%", size: "h-3 w-3" },
  { delay: "1.2s", drift: "6px", left: "60%", size: "h-5 w-5" },
];

type Props = {
  name: string;
  imagePath: string | null;
  isFavorite: boolean;
};

export function PlushiePhoto({ name, imagePath, isFavorite }: Props) {
  return (
    <div className="relative size-24 shrink-0 overflow-visible">
      <div className="flex size-full items-center justify-center overflow-hidden rounded-2xl border border-border-subtle bg-surface-overlay">
        {imagePath ? (
          <img
            src={`/api/uploads/${imagePath}`}
            alt={name}
            className="max-h-full max-w-full object-contain p-1.5"
          />
        ) : (
          <span className="text-2xl text-text-muted/40">?</span>
        )}
      </div>

      {isFavorite &&
        RISING_HEARTS.map((heart, i) => (
          <FontAwesomeIcon
            key={i}
            icon={FAVORITE_TRAIT.iconActive}
            aria-hidden
            className={`rising-heart pointer-events-none absolute bottom-3 text-accent opacity-0 group-hover:[animation:rise-heart_1.6s_ease-out_infinite] ${heart.size}`}
            style={
              {
                left: heart.left,
                "--drift": heart.drift,
                animationDelay: heart.delay,
              } as CSSProperties
            }
          />
        ))}
    </div>
  );
}
