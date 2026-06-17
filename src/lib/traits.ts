import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBaby,
  faDroplet,
  faGenderless,
  faGlobe,
  faMars,
  faPlane,
  faStarOfLife,
  faVenus,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartOutline } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import type { PlushieGender } from "@/types";

export const FAVORITE_TRAIT = {
  label: "Favorite",
  iconActive: faHeartSolid,
  iconInactive: faHeartOutline,
};

export const BOOLEAN_TRAITS = [
  { key: "is_imported" as const, icon: faGlobe, label: "Imported" },
  { key: "is_travel_buddy" as const, icon: faPlane, label: "Travel Buddy" },
  { key: "has_stickies" as const, icon: faDroplet, label: "Well Loved" },
  { key: "is_modded" as const, icon: faStarOfLife, label: "Modded" },
  { key: "is_padded" as const, icon: faBaby, label: "Padded" },
];

export const GENDER_TRAITS = {
  male: { icon: faMars, label: "Male" },
  female: { icon: faVenus, label: "Female" },
} as const satisfies Record<string, { icon: IconDefinition; label: string }>;

export const GENDERLESS_TRAIT = {
  icon: faGenderless,
  label: "Genderless",
};

export function getGenderTrait(gender: PlushieGender) {
  if (gender === "male" || gender === "female") return GENDER_TRAITS[gender];
  return GENDERLESS_TRAIT;
}
