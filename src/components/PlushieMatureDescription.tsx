"use client";

import { useMatureContent } from "@/components/MatureContentProvider";

type Props = {
  text: string;
  showAdmin?: boolean;
  className?: string;
};

export function PlushieMatureDescription({ text, showAdmin, className = "" }: Props) {
  const { matureEnabled } = useMatureContent();

  if (!text || (!matureEnabled && !showAdmin)) return null;

  return (
    <p className={`text-sm leading-relaxed text-text-muted/90 ${className}`.trim()}>
      {text}
    </p>
  );
}
