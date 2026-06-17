"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { getPlushieShareUrl } from "@/lib/plushie-url";
import "@/lib/fontawesome";

type Props = {
  plushieId: number;
  plushieName: string;
};

export function PlushieShareButton({ plushieId, plushieName }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = getPlushieShareUrl(plushieId);

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${plushieName} — PlushBroker`,
          url,
        });
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-text-muted transition-colors hover:bg-surface-overlay hover:text-text"
      aria-label={`Share ${plushieName}`}
    >
      <FontAwesomeIcon icon={faShareNodes} className="h-3.5 w-3.5" />
      {copied ? "Copied!" : "Share"}
    </button>
  );
}
