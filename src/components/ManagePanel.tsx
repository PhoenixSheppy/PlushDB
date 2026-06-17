"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Plushie } from "@/types";
import { PlushieForm, type PlushieFormData } from "./PlushieForm";
import { PlushieDetailModal } from "./PlushieDetailModal";
import { PlushieGrid } from "./PlushieGrid";

type Props = {
  initialPlushies: Plushie[];
};

function buildFormData(data: PlushieFormData, id?: number): FormData {
  const formData = new FormData();
  formData.set("name", data.name);
  formData.set("species", data.species);
  formData.set("description", data.description);
  formData.set("manufacturer", data.manufacturer);
  formData.set("acquired_date", data.acquired_date ?? "");
  formData.set("is_favorite", String(data.is_favorite));
  formData.set("has_stickies", String(data.has_stickies));
  formData.set("is_imported", String(data.is_imported));
  formData.set("is_travel_buddy", String(data.is_travel_buddy));
  formData.set("is_modded", String(data.is_modded));
  formData.set("is_padded", String(data.is_padded));
  formData.set("gender", data.gender ?? "");
  formData.set("remove_image", String(data.remove_image));
  if (data.image) formData.set("image", data.image);
  if (id) formData.set("id", String(id));
  return formData;
}

export function ManagePanel({ initialPlushies }: Props) {
  const router = useRouter();
  const [plushies, setPlushies] = useState(initialPlushies);
  const [selected, setSelected] = useState<Plushie | null>(null);
  const [editing, setEditing] = useState<Plushie | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function refresh() {
    const res = await fetch("/api/plushies");
    const data = await res.json();
    setPlushies(data);
    router.refresh();
  }

  async function handleCreate(data: PlushieFormData) {
    const res = await fetch("/api/plushies", {
      method: "POST",
      body: buildFormData(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create");
    }
    setShowForm(false);
    await refresh();
  }

  async function handleUpdate(data: PlushieFormData) {
    if (!editing) return;
    const res = await fetch("/api/plushies", {
      method: "PUT",
      body: buildFormData(data, editing.id),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update");
    }
    setEditing(null);
    await refresh();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this plushie from your collection?")) return;
    const res = await fetch(`/api/plushies?id=${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete");
    if (editing?.id === id) setEditing(null);
    await refresh();
  }

  async function handleToggleFavorite(id: number) {
    const res = await fetch(`/api/plushies/favorite?id=${id}`, { method: "PATCH" });
    if (!res.ok) throw new Error("Failed to toggle favorite");
    await refresh();
  }

  const formVisible = showForm || editing;

  return (
    <div className="space-y-8">
      {!formVisible && (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-surface transition-colors hover:bg-accent-hover"
        >
          <span className="text-lg leading-none">+</span>
          Add Plushie
        </button>
      )}

      {formVisible && (
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 text-lg font-semibold">
            {editing ? `Edit ${editing.name}` : "New Plushie"}
          </h2>
          <PlushieForm
            plushie={editing}
            onSubmit={editing ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
          />
        </div>
      )}

      {plushies.length > 0 ? (
        <PlushieGrid
          plushies={plushies}
          showAdmin
          onSelect={setSelected}
          onEdit={(p) => {
            setShowForm(false);
            setEditing(p);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
        />
      ) : (
        !formVisible && (
          <div className="glass rounded-2xl p-8 text-center text-text-muted">
            You don&apos;t have any plushies yet, let&apos;s get started! — hit the button above to add your first one!
          </div>
        )
      )}

      {selected && (
        <PlushieDetailModal plushie={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
