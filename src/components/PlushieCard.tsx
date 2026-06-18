import type { MouseEvent } from "react";
import type { Plushie } from "@/types";
import { formatDate } from "@/lib/format";
import { PlushieGenderIcon } from "./PlushieGenderIcon";
import { PlushieMatureDescription } from "./PlushieMatureDescription";
import { PlushiePhoto } from "./PlushiePhoto";
import { PlushieTraitRow } from "./PlushieTraits";
import { TiltCard } from "./TiltCard";

type Props = {
  plushie: Plushie;
  showAdmin?: boolean;
  onClick?: () => void;
  onEdit?: (plushie: Plushie) => void;
  onDelete?: (id: number) => void;
  onToggleFavorite?: (id: number) => void;
};

export function PlushieCard({
  plushie,
  showAdmin,
  onClick,
  onEdit,
  onDelete,
  onToggleFavorite,
}: Props) {
  const acquired = formatDate(plushie.acquired_date);

  function stopClick(e: MouseEvent) {
    e.stopPropagation();
  }

  return (
    <TiltCard>
      <article
        onClick={onClick}
        className={`glass group relative flex h-full flex-col rounded-2xl p-5 transition-colors hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10 ${
          onClick ? "cursor-pointer" : ""
        }`}
      >
      <div className="flex gap-4">
        <PlushiePhoto
          name={plushie.name}
          imagePath={plushie.image_path}
          isFavorite={plushie.is_favorite}
        />

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <h3 className="truncate text-lg font-semibold leading-tight">{plushie.name}</h3>
            <PlushieGenderIcon gender={plushie.gender} />
          </div>

          {plushie.species && (
            <p className="mt-0.5 truncate text-sm italic text-text-muted">{plushie.species}</p>
          )}

          {plushie.manufacturer && (
            <p className="mt-1 truncate text-sm text-text-muted">{plushie.manufacturer}</p>
          )}

          <PlushieTraitRow
            plushie={plushie}
            showAdmin={showAdmin}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
      </div>

      {plushie.description && (
        <p className="mt-3 text-sm leading-relaxed text-text-muted">{plushie.description}</p>
      )}

      <PlushieMatureDescription
        text={plushie.mature_description}
        showAdmin={showAdmin}
        className="mt-3"
      />

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border-subtle pt-3">
        {acquired ? (
          <span className="text-xs text-text-muted">Acquired {acquired}</span>
        ) : (
          <span />
        )}

        {showAdmin && (
          <div className="flex gap-2" onClick={stopClick}>
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(plushie)}
                className="rounded-md px-2 py-1 text-xs text-text-muted transition-colors hover:bg-surface-overlay hover:text-text"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(plushie.id)}
                className="rounded-md px-2 py-1 text-xs text-red-400/80 transition-colors hover:bg-red-400/10 hover:text-red-400"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </article>
    </TiltCard>
  );
}
