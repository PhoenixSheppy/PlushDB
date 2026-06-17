"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Vendor } from "@/types";
import { VendorList } from "./VendorList";
import { VendorForm, type VendorFormData } from "./VendorForm";

type Props = {
  initialVendors: Vendor[];
};

function buildFormData(data: VendorFormData, id?: number): FormData {
  const formData = new FormData();
  formData.set("name", data.name);
  formData.set("short_description", data.short_description);
  formData.set("description", data.description);
  formData.set("website_url", data.website_url);
  formData.set("location", data.location);
  formData.set("remove_logo", String(data.remove_logo));
  if (data.logo) formData.set("logo", data.logo);
  if (id) formData.set("id", String(id));
  return formData;
}

export function ManageVendorsPanel({ initialVendors }: Props) {
  const router = useRouter();
  const [vendors, setVendors] = useState(initialVendors);
  const [editing, setEditing] = useState<Vendor | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function refresh() {
    const res = await fetch("/api/vendors");
    const data = await res.json();
    setVendors(data);
    router.refresh();
  }

  async function handleCreate(data: VendorFormData) {
    const res = await fetch("/api/vendors", {
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

  async function handleUpdate(data: VendorFormData) {
    if (!editing) return;
    const res = await fetch("/api/vendors", {
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
    if (!confirm("Delete this vendor?")) return;
    const res = await fetch(`/api/vendors?id=${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete");
    if (editing?.id === id) setEditing(null);
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
          Add Vendor
        </button>
      )}

      {formVisible && (
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 text-lg font-semibold">
            {editing ? `Edit ${editing.name}` : "New Vendor"}
          </h2>
          <VendorForm
            vendor={editing}
            onSubmit={editing ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
          />
        </div>
      )}

      {vendors.length > 0 ? (
        <VendorList
          vendors={vendors}
          showAdmin
          onEdit={(v) => {
            setShowForm(false);
            setEditing(v);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onDelete={handleDelete}
        />
      ) : (
        !formVisible && (
          <div className="glass rounded-2xl p-8 text-center text-text-muted">
            No trusted vendors yet — add your first one above.
          </div>
        )
      )}
    </div>
  );
}
