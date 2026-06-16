import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FAVORITE_TRAIT } from "@/lib/traits";
import "@/lib/fontawesome";

type Props = {
  total: number;
  favorites: number;
};

export function CollectionStats({ total, favorites }: Props) {
  return (
    <div className="flex justify-center gap-6 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-accent">{total}</span>
        <span className="text-text-muted">{total === 1 ? "plushie" : "plushies"}</span>
      </div>
      {favorites > 0 && (
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={FAVORITE_TRAIT.iconActive} className="h-4 w-4 text-accent" />
          <span className="text-2xl font-bold">{favorites}</span>
          <span className="text-text-muted">favorites</span>
        </div>
      )}
    </div>
  );
}
