"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import "@/lib/fontawesome";

type Props = {
  icon: IconDefinition;
  active?: boolean;
  className?: string;
};

export function TraitIcon({ icon, active = true, className = "" }: Props) {
  return (
    <FontAwesomeIcon
      icon={icon}
      className={`h-4 w-4 text-accent transition-opacity ${active ? "" : "opacity-35"} ${className}`}
    />
  );
}
