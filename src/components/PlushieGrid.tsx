"use client";

import { useState } from "react";
import type { Plushie } from "@/types";
import { PlushieCard } from "./PlushieCard";
import { PlushieDetailModal } from "./PlushieDetailModal";

type Props = {
  plushies: Plushie[];
  showAdmin?: boolean;
  onEdit?: (plushie: Plushie) => void;
  onDelete?: (id: number) => void;
  onToggleFavorite?: (id: number) => void;
};

export function PlushieGrid({ plushies, showAdmin, onEdit, onDelete, onToggleFavorite }: Props) {
  const [selected, setSelected] = useState<Plushie | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plushies.map((plushie) => (
          <PlushieCard
            key={plushie.id}
            plushie={plushie}
            showAdmin={showAdmin}
            onClick={() => setSelected(plushie)}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>

      {selected && (
        <PlushieDetailModal plushie={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
