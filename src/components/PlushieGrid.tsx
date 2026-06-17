"use client";

import type { Plushie } from "@/types";
import { PlushieCard } from "./PlushieCard";

type Props = {
  plushies: Plushie[];
  showAdmin?: boolean;
  onSelect?: (plushie: Plushie) => void;
  onEdit?: (plushie: Plushie) => void;
  onDelete?: (id: number) => void;
  onToggleFavorite?: (id: number) => void;
};

export function PlushieGrid({
  plushies,
  showAdmin,
  onSelect,
  onEdit,
  onDelete,
  onToggleFavorite,
}: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {plushies.map((plushie) => (
        <PlushieCard
          key={plushie.id}
          plushie={plushie}
          showAdmin={showAdmin}
          onClick={onSelect ? () => onSelect(plushie) : undefined}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
