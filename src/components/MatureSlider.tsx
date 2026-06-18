"use client";

import { useMatureContent } from "@/components/MatureContentProvider";

export function MatureSlider() {
  const { matureEnabled, requestEnable, disable } = useMatureContent();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      requestEnable();
      return;
    }
    disable();
  }

  return (
    <div className="flex items-center gap-2 text-xs text-text-muted/70 select-none">
      <span>Mature Content</span>
      <label className="cursor-pointer rounded-md p-1.5 transition-colors hover:bg-surface-overlay">
        <span className="relative inline-flex h-5 w-9 shrink-0 items-center">
          <input
            type="checkbox"
            role="switch"
            checked={matureEnabled}
            onChange={handleChange}
            aria-label="Show mature content"
            className="peer sr-only"
          />
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-surface-overlay ring-1 ring-border-subtle transition-colors peer-checked:bg-accent/30 peer-checked:ring-accent/40"
          />
          <span
            aria-hidden
            className="absolute left-0.5 size-4 rounded-full bg-text-muted/50 transition-transform peer-checked:translate-x-4 peer-checked:bg-accent"
          />
        </span>
      </label>
    </div>
  );
}
