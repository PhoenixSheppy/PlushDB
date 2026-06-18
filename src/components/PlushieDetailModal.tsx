"use client";

import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  FAVORITE_TRAIT,
  getVisibleBooleanTraits,
} from "@/lib/traits";
import { useMatureContent } from "@/components/MatureContentProvider";
import { formatDate } from "@/lib/format";
import type { Plushie } from "@/types";
import { PlushieGenderIcon } from "./PlushieGenderIcon";
import { PlushieMatureDescription } from "./PlushieMatureDescription";
import { PlushieShareButton } from "./PlushieShareButton";
import { TraitIcon } from "./TraitIcon";
import "@/lib/fontawesome";

type Props = {
  plushie: Plushie;
  onClose: () => void;
  showAdmin?: boolean;
};

export function PlushieDetailModal({ plushie, onClose, showAdmin }: Props) {
  const { matureEnabled } = useMatureContent();
  const visibleTraits = getVisibleBooleanTraits(matureEnabled);
  const acquired = formatDate(plushie.acquired_date);
  const favoriteIcon = plushie.is_favorite
    ? FAVORITE_TRAIT.iconActive
    : FAVORITE_TRAIT.iconInactive;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="plushie-detail-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-surface/80 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />

      <div className="glass relative z-10 w-full max-w-lg scale-100 rounded-2xl p-6 shadow-2xl shadow-black/40 transition-all duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface-overlay hover:text-text"
          aria-label="Close"
        >
          <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
        </button>

        <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
          <div className="mx-auto flex size-48 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border-subtle bg-surface-overlay sm:mx-0 sm:size-52">
            {plushie.image_path ? (
              <img
                src={`/api/uploads/${plushie.image_path}`}
                alt={plushie.name}
                className="max-h-full max-w-full rounded-2xl object-contain p-3"
              />
            ) : (
              <span className="text-4xl text-text-muted/40">?</span>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-3 pr-6">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 id="plushie-detail-title" className="text-2xl font-bold leading-tight">
                  {plushie.name}
                </h2>
                <PlushieGenderIcon gender={plushie.gender} className="h-4 w-4" />
              </div>
              {plushie.species && (
                <p className="mt-1 text-sm italic text-text-muted">{plushie.species}</p>
              )}
              {plushie.manufacturer && (
                <p className="mt-1 text-sm text-text-muted">{plushie.manufacturer}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <TraitLegendItem
                icon={favoriteIcon}
                label={FAVORITE_TRAIT.label}
                active={plushie.is_favorite}
              />
              {visibleTraits.map((trait) => (
                <TraitLegendItem
                  key={trait.key}
                  icon={trait.icon}
                  label={trait.label}
                  active={plushie[trait.key]}
                />
              ))}
            </div>
          </div>
        </div>

        {plushie.description && (
          <p className="mt-6 text-sm leading-relaxed text-text-muted">{plushie.description}</p>
        )}

        <PlushieMatureDescription
          text={plushie.mature_description}
          showAdmin={showAdmin}
          className="mt-4"
        />

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border-subtle pt-4">
          {acquired ? (
            <span className="text-xs text-text-muted">Acquired {acquired}</span>
          ) : (
            <span />
          )}
          <PlushieShareButton plushieId={plushie.id} plushieName={plushie.name} />
        </div>
      </div>
    </div>
  );
}

function TraitLegendItem({
  icon,
  label,
  active,
}: {
  icon: typeof FAVORITE_TRAIT.iconActive;
  label: string;
  active: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 text-xs ${active ? "text-text-muted" : "text-text-muted/40"}`}
    >
      <TraitIcon icon={icon} active={active} className="h-3.5 w-3.5" />
      <span>{label}</span>
    </div>
  );
}
