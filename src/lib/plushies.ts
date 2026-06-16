import { getDb } from "./db";
import { deleteImage } from "./uploads";
import type { Plushie, PlushieInput } from "@/types";

type PlushieRow = {
  id: number;
  name: string;
  species: string;
  description: string;
  manufacturer: string;
  acquired_date: string | null;
  is_favorite: number;
  has_stickies: number;
  is_imported: number;
  is_travel_buddy: number;
  is_modded: number;
  gender: string | null;
  image_path: string | null;
  created_at: string;
  updated_at: string;
};

function rowToPlushie(row: PlushieRow): Plushie {
  const gender = row.gender === "male" || row.gender === "female" ? row.gender : null;

  return {
    ...row,
    is_favorite: row.is_favorite === 1,
    has_stickies: row.has_stickies === 1,
    is_imported: row.is_imported === 1,
    is_travel_buddy: row.is_travel_buddy === 1,
    is_modded: row.is_modded === 1,
    gender,
    image_path: row.image_path ?? null,
  };
}

export function getAllPlushies(favoritesOnly = false): Plushie[] {
  const db = getDb();
  const query = favoritesOnly
    ? "SELECT * FROM plushies WHERE is_favorite = 1 ORDER BY name COLLATE NOCASE ASC"
    : "SELECT * FROM plushies ORDER BY is_favorite DESC, name COLLATE NOCASE ASC";
  const rows = db.prepare(query).all() as PlushieRow[];
  return rows.map(rowToPlushie);
}

export function getPlushieById(id: number): Plushie | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM plushies WHERE id = ?").get(id) as PlushieRow | undefined;
  return row ? rowToPlushie(row) : null;
}

export function createPlushie(input: PlushieInput): Plushie {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO plushies (name, species, description, manufacturer, acquired_date, is_favorite, has_stickies, is_imported, is_travel_buddy, is_modded, gender, image_path, updated_at)
       VALUES (@name, @species, @description, @manufacturer, @acquired_date, @is_favorite, @has_stickies, @is_imported, @is_travel_buddy, @is_modded, @gender, @image_path, datetime('now'))`
    )
    .run({
      name: input.name.trim(),
      species: input.species?.trim() ?? "",
      description: input.description?.trim() ?? "",
      manufacturer: input.manufacturer?.trim() ?? "",
      acquired_date: input.acquired_date || null,
      is_favorite: input.is_favorite ? 1 : 0,
      has_stickies: input.has_stickies ? 1 : 0,
      is_imported: input.is_imported ? 1 : 0,
      is_travel_buddy: input.is_travel_buddy ? 1 : 0,
      is_modded: input.is_modded ? 1 : 0,
      gender: input.gender ?? null,
      image_path: input.image_path ?? null,
    });

  return getPlushieById(Number(result.lastInsertRowid))!;
}

export function updatePlushie(id: number, input: PlushieInput): Plushie | null {
  const existing = getPlushieById(id);
  if (!existing) return null;

  let imagePath = existing.image_path;

  if (input.remove_image) {
    deleteImage(imagePath);
    imagePath = null;
  } else if (input.image_path !== undefined) {
    if (input.image_path !== existing.image_path) {
      deleteImage(existing.image_path);
    }
    imagePath = input.image_path;
  }

  const db = getDb();
  const result = db
    .prepare(
      `UPDATE plushies
       SET name = @name,
           species = @species,
           description = @description,
           manufacturer = @manufacturer,
           acquired_date = @acquired_date,
           is_favorite = @is_favorite,
           has_stickies = @has_stickies,
           is_imported = @is_imported,
           is_travel_buddy = @is_travel_buddy,
           is_modded = @is_modded,
           gender = @gender,
           image_path = @image_path,
           updated_at = datetime('now')
       WHERE id = @id`
    )
    .run({
      id,
      name: input.name.trim(),
      species: input.species?.trim() ?? "",
      description: input.description?.trim() ?? "",
      manufacturer: input.manufacturer?.trim() ?? "",
      acquired_date: input.acquired_date || null,
      is_favorite: input.is_favorite ? 1 : 0,
      has_stickies: input.has_stickies ? 1 : 0,
      is_imported: input.is_imported ? 1 : 0,
      is_travel_buddy: input.is_travel_buddy ? 1 : 0,
      is_modded: input.is_modded ? 1 : 0,
      gender: input.gender ?? null,
      image_path: imagePath,
    });

  if (result.changes === 0) return null;
  return getPlushieById(id);
}

export function deletePlushie(id: number): boolean {
  const existing = getPlushieById(id);
  if (!existing) return false;

  const db = getDb();
  const result = db.prepare("DELETE FROM plushies WHERE id = ?").run(id);
  if (result.changes > 0) {
    deleteImage(existing.image_path);
    return true;
  }
  return false;
}

export function toggleFavorite(id: number): Plushie | null {
  const plushie = getPlushieById(id);
  if (!plushie) return null;
  return updatePlushie(id, { ...plushie, is_favorite: !plushie.is_favorite });
}

export function getPlushieCount(): number {
  const db = getDb();
  const row = db.prepare("SELECT COUNT(*) as count FROM plushies").get() as { count: number };
  return row.count;
}

export function getUserByUsername(username: string) {
  const db = getDb();
  return db
    .prepare("SELECT id, username, password_hash FROM users WHERE username = ?")
    .get(username) as { id: number; username: string; password_hash: string } | undefined;
}

export function createUser(username: string, passwordHash: string) {
  const db = getDb();
  return db
    .prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)")
    .run(username, passwordHash);
}

export function hasUsers(): boolean {
  const db = getDb();
  const row = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
  return row.count > 0;
}
