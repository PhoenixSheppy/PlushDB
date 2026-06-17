"use client";

import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { getPlushieShareUrl } from "@/lib/plushie-url";
import "@/lib/fontawesome";

type Props = {
  plushieId: number;
  plushieName: string;
};

function canUseNativeShare(shareData: ShareData): boolean {
  if (typeof navigator.share !== "function") return false;
  if (typeof navigator.canShare !== "function" || !navigator.canShare(shareData)) return false;
  return window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
}

function copySync(text: string, input: HTMLInputElement | null): boolean {
  if (!input) return false;

  input.value = text;
  input.focus();
  input.select();
  input.setSelectionRange(0, text.length);

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  }
}

export function PlushieShareButton({ plushieId, plushieName }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [showManualCopy, setShowManualCopy] = useState(false);

  function showCopiedFeedback() {
    setCopied(true);
    setShowManualCopy(false);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function handleShare() {
    const url = getPlushieShareUrl(plushieId);
    const shareData: ShareData = { title: `${plushieName} — PlushBroker`, url };

    if (canUseNativeShare(shareData)) {
      navigator.share(shareData).catch((error) => {
        if (error instanceof Error && error.name === "AbortError") return;
      });
      return;
    }

    if (copySync(url, inputRef.current)) {
      showCopiedFeedback();
      return;
    }

    setShowManualCopy(true);
    if (inputRef.current) {
      inputRef.current.value = url;
    }
    window.requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }

  return (
    <div className="relative flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-text-muted transition-colors hover:bg-surface-overlay hover:text-text"
        aria-label={`Share ${plushieName}`}
      >
        <FontAwesomeIcon icon={faShareNodes} className="h-3.5 w-3.5" />
        {copied ? "Copied!" : "Share"}
      </button>

      <input
        ref={inputRef}
        readOnly
        aria-hidden={!showManualCopy}
        tabIndex={showManualCopy ? 0 : -1}
        className={`absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 ${
          showManualCopy
            ? "static h-8 w-52 rounded-md border border-border bg-surface-overlay px-2 text-xs text-text"
            : "opacity-0"
        }`}
        onFocus={(e) => e.target.select()}
      />
    </div>
  );
}