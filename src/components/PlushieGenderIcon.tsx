import { getGenderTrait } from "@/lib/traits";
import type { PlushieGender } from "@/types";
import { TraitIcon } from "./TraitIcon";

type Props = {
  gender: PlushieGender;
  className?: string;
};

export function PlushieGenderIcon({ gender, className = "h-3.5 w-3.5" }: Props) {
  const { icon } = getGenderTrait(gender);

  return (
    <TraitIcon
      icon={icon}
      active={gender !== null}
      className={`shrink-0 ${className}`}
    />
  );
}
