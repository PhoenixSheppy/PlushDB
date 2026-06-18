"use client";

import { useEffect, useState } from "react";
import type { Vendor } from "@/types";

export type VendorFormData = {
  name: string;
  short_description: string;
  description: string;
  website_url: string;
  location: string;
  is_mature: boolean;
  logo: File | null;
  remove_logo: boolean;
};

type Props = {
  vendor?: Vendor | null;
  onSubmit: (data: VendorFormData) => Promise<void>;
  onCancel?: () => void;
};

export function VendorForm({ vendor, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(vendor?.name ?? "");
  const [shortDescription, setShortDescription] = useState(vendor?.short_description ?? "");
  const [description, setDescription] = useState(vendor?.description ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(vendor?.website_url ?? "");
  const [location, setLocation] = useState(vendor?.location ?? "");
  const [isMature, setIsMature] = useState(vendor?.is_mature ?? false);
  const [logo, setLogo] = useState<File | null>(null);
  const [removeLogo, setRemoveLogo] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    vendor?.logo_path ? `/api/uploads/${vendor.logo_path}` : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!logo) return;
    const url = URL.createObjectURL(logo);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [logo]);

  useEffect(() => {
    if (logo) return;
    setPreviewUrl(
      removeLogo || !vendor?.logo_path ? null : `/api/uploads/${vendor.logo_path}`
    );
  }, [vendor?.logo_path, logo, removeLogo]);

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setLogo(file);
    if (file) setRemoveLogo(false);
  }

  function handleRemoveLogo() {
    setLogo(null);
    setRemoveLogo(true);
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
        short_description: shortDescription.trim(),
        description: description.trim(),
        website_url: websiteUrl.trim(),
        location: location.trim(),
        is_mature: isMature,
        logo,
        remove_logo: removeLogo,
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
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="vendor-name" className="block text-sm font-medium text-text-muted">
          Name *
        </label>
        <input
          id="vendor-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="vendor-short-description" className="block text-sm font-medium text-text-muted">
          Short Description
        </label>
        <input
          id="vendor-short-description"
          type="text"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          placeholder="A quick tagline"
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="vendor-location" className="block text-sm font-medium text-text-muted">
          Location
        </label>
        <input
          id="vendor-location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City, Country or Online"
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="vendor-website" className="block text-sm font-medium text-text-muted">
          Website URL
        </label>
        <input
          id="vendor-website"
          type="url"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          placeholder="https://example.com"
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="vendor-description" className="block text-sm font-medium text-text-muted">
          Description
        </label>
        <textarea
          id="vendor-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className={inputClass}
        />
      </div>

      <div className="space-y-4 rounded-xl border border-border-subtle bg-surface-overlay/30 p-4">
        <div>
          <p className="text-sm font-medium text-text-muted">Mature content</p>
          <p className="mt-1 text-xs leading-relaxed text-text-muted">
            Modders are only shown on the public vendors page when visitors enable mature content
            in the footer.
          </p>
        </div>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={isMature}
            onChange={(e) => setIsMature(e.target.checked)}
            className="size-4 rounded border-border bg-surface-overlay text-accent focus:ring-accent"
          />
          <span className="text-sm text-text-muted">Modder</span>
        </label>
      </div>

      <div className="space-y-2">
        <label htmlFor="vendor-logo" className="block text-sm font-medium text-text-muted">
          Logo
        </label>
        {previewUrl && (
          <div className="mb-2 flex size-32 items-center justify-center overflow-hidden rounded-2xl border border-border-subtle bg-surface-overlay">
            <img
              src={previewUrl}
              alt="Logo preview"
              className="max-h-full max-w-full rounded-2xl object-contain p-1.5"
            />
          </div>
        )}
        <input
          id="vendor-logo"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleLogoChange}
          className="block w-full text-sm text-text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-medium file:text-surface hover:file:bg-accent-hover"
        />
        {previewUrl && (
          <button
            type="button"
            onClick={handleRemoveLogo}
            className="text-sm text-red-400/80 transition-colors hover:text-red-400"
          >
            Remove logo
          </button>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-surface transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          {loading ? "Saving..." : vendor ? "Save Changes" : "Add Vendor"}
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
