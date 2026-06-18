"use client";

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { BOOLEAN_TRAITS, FAVORITE_TRAIT, getVisibleBooleanTraits } from "@/lib/traits";
import { useMatureContent } from "@/components/MatureContentProvider";
import type { Plushie } from "@/types";
import { TraitIcon } from "./TraitIcon";

type TraitItemProps = {
  label: string;
  active?: boolean;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  interactive?: boolean;
};

function TraitItem({
  label,
  active = true,
  children,
  onClick,
  interactive = false,
}: TraitItemProps) {
  const iconClass = `rounded p-0.5 transition-opacity ${active ? "" : "opacity-35"} ${
    interactive ? "cursor-pointer hover:opacity-100" : ""
  }`;

  return (
    <div className="group/trait relative shrink-0">
      {interactive && onClick ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(e);
          }}
          className={iconClass}
          aria-label={label}
        >
          {children}
        </button>
      ) : (
        <span className={iconClass} aria-hidden={!active}>
          {children}
        </span>
      )}
      <span className="pointer-events-none absolute top-full left-1/2 z-10 mt-1 -translate-x-1/2 whitespace-nowrap text-[10px] leading-tight text-text-muted opacity-0 transition-opacity group-hover/trait:opacity-100">
        {label}
      </span>
    </div>
  );
}

type Props = {
  plushie: Plushie;
  showAdmin?: boolean;
  onToggleFavorite?: (id: number) => void;
};

export function PlushieTraitRow({ plushie, showAdmin, onToggleFavorite }: Props) {
  const { matureEnabled } = useMatureContent();
  const visibleTraits = showAdmin ? BOOLEAN_TRAITS : getVisibleBooleanTraits(matureEnabled);
  const favoriteIcon: IconDefinition = plushie.is_favorite
    ? FAVORITE_TRAIT.iconActive
    : FAVORITE_TRAIT.iconInactive;

  return (
    <div className="relative mt-2 pb-3.5">
      <div className="flex flex-nowrap items-center gap-1.5">
        <TraitItem
          label={FAVORITE_TRAIT.label}
          active={plushie.is_favorite}
          interactive={showAdmin && !!onToggleFavorite}
          onClick={
            showAdmin && onToggleFavorite
              ? () => onToggleFavorite(plushie.id)
              : undefined
          }
        >
          <TraitIcon icon={favoriteIcon} active={plushie.is_favorite} />
        </TraitItem>

        {visibleTraits.map((trait) => (
          <TraitItem
            key={trait.key}
            label={trait.label}
            active={plushie[trait.key]}
          >
            <TraitIcon icon={trait.icon} active={plushie[trait.key]} />
          </TraitItem>
        ))}
      </div>
    </div>
  );
}
