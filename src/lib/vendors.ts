import { getDb } from "./db";
import { deleteImage } from "./uploads";
import type { Vendor, VendorInput } from "@/types";

type VendorRow = {
  id: number;
  name: string;
  short_description: string;
  description: string;
  website_url: string;
  location: string;
  logo_path: string | null;
  created_at: string;
  updated_at: string;
};

function rowToVendor(row: VendorRow): Vendor {
  return {
    ...row,
    logo_path: row.logo_path ?? null,
  };
}

export function getAllVendors(): Vendor[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM vendors ORDER BY name COLLATE NOCASE ASC")
    .all() as VendorRow[];
  return rows.map(rowToVendor);
}

export function getVendorById(id: number): Vendor | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM vendors WHERE id = ?").get(id) as VendorRow | undefined;
  return row ? rowToVendor(row) : null;
}

export function createVendor(input: VendorInput): Vendor {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO vendors (name, short_description, description, website_url, location, logo_path, updated_at)
       VALUES (@name, @short_description, @description, @website_url, @location, @logo_path, datetime('now'))`
    )
    .run({
      name: input.name.trim(),
      short_description: input.short_description?.trim() ?? "",
      description: input.description?.trim() ?? "",
      website_url: input.website_url?.trim() ?? "",
      location: input.location?.trim() ?? "",
      logo_path: input.logo_path ?? null,
    });

  return getVendorById(Number(result.lastInsertRowid))!;
}

export function updateVendor(id: number, input: VendorInput): Vendor | null {
  const existing = getVendorById(id);
  if (!existing) return null;

  let logoPath = existing.logo_path;

  if (input.remove_logo) {
    deleteImage(logoPath);
    logoPath = null;
  } else if (input.logo_path !== undefined) {
    if (input.logo_path !== existing.logo_path) {
      deleteImage(existing.logo_path);
    }
    logoPath = input.logo_path;
  }

  const db = getDb();
  const result = db
    .prepare(
      `UPDATE vendors
       SET name = @name,
           short_description = @short_description,
           description = @description,
           website_url = @website_url,
           location = @location,
           logo_path = @logo_path,
           updated_at = datetime('now')
       WHERE id = @id`
    )
    .run({
      id,
      name: input.name.trim(),
      short_description: input.short_description?.trim() ?? "",
      description: input.description?.trim() ?? "",
      website_url: input.website_url?.trim() ?? "",
      location: input.location?.trim() ?? "",
      logo_path: logoPath,
    });

  if (result.changes === 0) return null;
  return getVendorById(id);
}

export function deleteVendor(id: number): boolean {
  const existing = getVendorById(id);
  if (!existing) return false;

  const db = getDb();
  const result = db.prepare("DELETE FROM vendors WHERE id = ?").run(id);
  if (result.changes > 0) {
    deleteImage(existing.logo_path);
    return true;
  }
  return false;
}
