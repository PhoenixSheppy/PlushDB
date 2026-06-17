"use client";

import { useEffect, useState } from "react";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import type { Plushie, PlushieGender } from "@/types";
import { BOOLEAN_TRAITS, FAVORITE_TRAIT, GENDER_TRAITS } from "@/lib/traits";
import { TraitIcon } from "./TraitIcon";
import "@/lib/fontawesome";

export type PlushieFormData = {
  name: string;
  species: string;
  description: string;
  manufacturer: string;
  acquired_date: string | null;
  is_favorite: boolean;
  has_stickies: boolean;
  is_imported: boolean;
  is_travel_buddy: boolean;
  is_modded: boolean;
  is_padded: boolean;
  gender: PlushieGender;
  image: File | null;
  remove_image: boolean;
};

type BooleanTraitKey = (typeof BOOLEAN_TRAITS)[number]["key"];

function initialTraits(plushie?: Plushie | null): Record<BooleanTraitKey, boolean> {
  return {
    has_stickies: plushie?.has_stickies ?? false,
    is_imported: plushie?.is_imported ?? false,
    is_travel_buddy: plushie?.is_travel_buddy ?? false,
    is_modded: plushie?.is_modded ?? false,
    is_padded: plushie?.is_padded ?? false,
  };
}

type Props = {
  plushie?: Plushie | null;
  onSubmit: (data: PlushieFormData) => Promise<void>;
  onCancel?: () => void;
};

export function PlushieForm({ plushie, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(plushie?.name ?? "");
  const [species, setSpecies] = useState(plushie?.species ?? "");
  const [description, setDescription] = useState(plushie?.description ?? "");
  const [manufacturer, setManufacturer] = useState(plushie?.manufacturer ?? "");
  const [acquiredDate, setAcquiredDate] = useState(plushie?.acquired_date ?? "");
  const [isFavorite, setIsFavorite] = useState(plushie?.is_favorite ?? false);
  const [traits, setTraits] = useState(initialTraits(plushie));
  const [gender, setGender] = useState<PlushieGender>(plushie?.gender ?? null);
  const [image, setImage] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    plushie?.image_path ? `/api/uploads/${plushie.image_path}` : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!image) return;
    const url = URL.createObjectURL(image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  useEffect(() => {
    if (image) return;
    setPreviewUrl(
      removeImage || !plushie?.image_path ? null : `/api/uploads/${plushie.image_path}`
    );
  }, [plushie?.image_path, image, removeImage]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImage(file);
    if (file) setRemoveImage(false);
  }

  function handleRemoveImage() {
    setImage(null);
    setRemoveImage(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        species: species.trim(),
        description: description.trim(),
        manufacturer: manufacturer.trim(),
        acquired_date: acquiredDate || null,
        is_favorite: isFavorite,
        has_stickies: traits.has_stickies,
        is_imported: traits.is_imported,
        is_travel_buddy: traits.is_travel_buddy,
        is_modded: traits.is_modded,
        is_padded: traits.is_padded,
        gender,
        image,
        remove_image: removeImage,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-surface-overlay px-4 py-2.5 text-text placeholder:text-text-muted/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-text-muted">
          Name <span className="text-accent">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={inputClass}
          placeholder="e.g. Marshmallow"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="species" className="block text-sm font-medium text-text-muted">
          Species / Genus
        </label>
        <input
          id="species"
          type="text"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          className={inputClass}
          placeholder="e.g. Gray wolf"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="image" className="block text-sm font-medium text-text-muted">
          Photo
        </label>
        {previewUrl && (
          <div className="mb-2 flex size-32 items-center justify-center overflow-hidden rounded-2xl border border-border-subtle bg-surface-overlay">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-full max-w-full rounded-2xl object-contain p-1.5"
            />
          </div>
        )}
        <input
          id="image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleImageChange}
          className="block w-full text-sm text-text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-medium file:text-surface hover:file:bg-accent-hover"
        />
        <p className="text-xs text-text-muted">JPEG, PNG, WebP, or GIF — max 5 MB</p>
        {plushie?.image_path && !removeImage && !image && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="text-sm text-red-400/80 hover:text-red-400"
          >
            Remove current photo
          </button>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-text-muted">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder="A short note about this plushie…"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="manufacturer" className="block text-sm font-medium text-text-muted">
            Manufacturer
          </label>
          <input
            id="manufacturer"
            type="text"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            className={inputClass}
            placeholder="e.g. Jellycat"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="acquired_date" className="block text-sm font-medium text-text-muted">
            Date Acquired
          </label>
          <input
            id="acquired_date"
            type="date"
            value={acquiredDate}
            onChange={(e) => setAcquiredDate(e.target.value)}
            className={`${inputClass} [color-scheme:dark]`}
          />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-text-muted">Traits</p>
        <div className="flex flex-wrap gap-2">
          <TraitToggle
            active={isFavorite}
            onClick={() => setIsFavorite((v) => !v)}
            icon={isFavorite ? FAVORITE_TRAIT.iconActive : FAVORITE_TRAIT.iconInactive}
            label="Favorite"
          />
          {BOOLEAN_TRAITS.map((trait) => (
            <TraitToggle
              key={trait.key}
              active={traits[trait.key]}
              onClick={() =>
                setTraits((current) => ({ ...current, [trait.key]: !current[trait.key] }))
              }
              icon={trait.icon}
              label={trait.label}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <p className="w-full text-xs text-text-muted">Gender</p>
          {(["male", "female"] as const).map((g) => (
            <TraitToggle
              key={g}
              active={gender === g}
              onClick={() => setGender((current) => (current === g ? null : g))}
              icon={GENDER_TRAITS[g].icon}
              label={GENDER_TRAITS[g].label}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-surface transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          {loading ? "Saving…" : plushie ? "Update Plushie" : "Add Plushie"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-border px-5 py-2.5 text-sm text-text-muted transition-colors hover:bg-surface-overlay hover:text-text"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function TraitToggle({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: IconDefinition;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-2 transition-colors ${
        active
          ? "border-accent/50 bg-accent/10"
          : "border-border-subtle bg-surface-overlay/50 hover:border-border"
      }`}
    >
      <TraitIcon icon={icon} active={active} />
      <span className="text-[10px] leading-tight text-text-muted">{label}</span>
    </button>
  );
}
