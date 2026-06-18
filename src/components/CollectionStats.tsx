import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FAVORITE_TRAIT,
  MODDED_TRAIT,
  PADDED_TRAIT,
  WELL_LOVED_TRAIT,
} from "@/lib/traits";
import "@/lib/fontawesome";

type Props = {
  total: number;
  favorites: number;
  wellLoved: number;
  modded: number;
  padded: number;
  showMatureStats?: boolean;
};

function TraitStat({
  icon,
  count,
  label,
}: {
  icon: IconDefinition;
  count: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <FontAwesomeIcon icon={icon} className="h-4 w-4 text-accent" />
      <span className="text-2xl font-bold">{count}</span>
      <span className="text-text-muted">{label}</span>
    </div>
  );
}

export function CollectionStats({
  total,
  favorites,
  wellLoved,
  modded,
  padded,
  showMatureStats = true,
}: Props) {
  return (
    <div className="flex flex-wrap justify-center gap-6 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-accent">{total}</span>
        <span className="text-text-muted">{total === 1 ? "plushie" : "plushies"}</span>
      </div>
      {favorites > 0 && (
        <TraitStat
          icon={FAVORITE_TRAIT.iconActive}
          count={favorites}
          label="favorites"
        />
      )}
      {showMatureStats && wellLoved > 0 && (
        <TraitStat icon={WELL_LOVED_TRAIT.icon} count={wellLoved} label="well loved" />
      )}
      {showMatureStats && modded > 0 && (
        <TraitStat icon={MODDED_TRAIT.icon} count={modded} label="modded" />
      )}
      {showMatureStats && padded > 0 && (
        <TraitStat icon={PADDED_TRAIT.icon} count={padded} label="padded" />
      )}
    </div>
  );
}
