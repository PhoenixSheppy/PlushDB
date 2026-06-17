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

function legacyCopy(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);
  return copied;
}

function copyLink(url: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(url).then(
      () => true,
      () => Promise.resolve(legacyCopy(url))
    );
  }
  return Promise.resolve(legacyCopy(url));
}

export function PlushieShareButton({ plushieId, plushieName }: Props) {
  const [copied, setCopied] = useState(false);

  function showCopied() {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function handleShare() {
    const url = getPlushieShareUrl(plushieId);
    const shareData = { title: `${plushieName} — PlushBroker`, url };

    if (typeof navigator.share === "function" && navigator.canShare?.(shareData)) {
      navigator.share(shareData).catch((error) => {
        if (error instanceof Error && error.name === "AbortError") return;
        void copyLink(url).then((ok) => {
          if (ok) showCopied();
        });
      });
      return;
    }

    void copyLink(url).then((ok) => {
      if (ok) showCopied();
    });
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
