import { NextRequest, NextResponse } from "next/server";
import {
  createPlushie,
  deletePlushie,
  getAllPlushies,
  updatePlushie,
} from "@/lib/plushies";
import { parseJsonBody, requireAuth } from "@/lib/api";
import { saveImage } from "@/lib/uploads";
import type { PlushieInput, PlushieGender } from "@/types";

function parseGender(value: FormDataEntryValue | null): PlushieGender {
  const str = String(value ?? "");
  if (str === "male" || str === "female") return str;
  return null;
}

function parsePlushieFormData(formData: FormData): PlushieInput & { imageFile: File | null } {
  const imageEntry = formData.get("image");
  const imageFile =
    imageEntry instanceof File && imageEntry.size > 0 ? imageEntry : null;

  return {
    name: String(formData.get("name") ?? ""),
    species: String(formData.get("species") ?? ""),
    description: String(formData.get("description") ?? ""),
    mature_description: String(formData.get("mature_description") ?? ""),
    manufacturer: String(formData.get("manufacturer") ?? ""),
    acquired_date: String(formData.get("acquired_date") ?? "") || null,
    is_favorite: formData.get("is_favorite") === "true",
    has_stickies: formData.get("has_stickies") === "true",
    is_imported: formData.get("is_imported") === "true",
    is_travel_buddy: formData.get("is_travel_buddy") === "true",
    is_modded: formData.get("is_modded") === "true",
    is_padded: formData.get("is_padded") === "true",
    gender: parseGender(formData.get("gender")),
    remove_image: formData.get("remove_image") === "true",
    imageFile,
  };
}

async function parsePlushieInput(
  request: NextRequest
): Promise<(PlushieInput & { id?: number }) | NextResponse> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const { imageFile, ...input } = parsePlushieFormData(formData);
    const id = formData.get("id");

    if (imageFile) {
      try {
        input.image_path = await saveImage(imageFile);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to upload image";
        return NextResponse.json({ error: message }, { status: 400 });
      }
    }

    return {
      ...input,
      id: id ? Number(id) : undefined,
    };
  }

  const body = await parseJsonBody<PlushieInput & { id?: number }>(request);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  return body;
}

export async function GET(request: NextRequest) {
  const favoritesOnly = request.nextUrl.searchParams.get("favorites") === "true";
  const plushies = getAllPlushies(favoritesOnly);
  return NextResponse.json(plushies);
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const parsed = await parsePlushieInput(request);
  if (parsed instanceof NextResponse) return parsed;

  if (!parsed.name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const plushie = createPlushie(parsed);
  return NextResponse.json(plushie, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const parsed = await parsePlushieInput(request);
  if (parsed instanceof NextResponse) return parsed;

  if (!parsed.id || !parsed.name?.trim()) {
    return NextResponse.json({ error: "ID and name are required" }, { status: 400 });
  }

  const plushie = updatePlushie(parsed.id, parsed);
  if (!plushie) {
    return NextResponse.json({ error: "Plushie not found" }, { status: 404 });
  }

  return NextResponse.json(plushie);
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const id = Number(request.nextUrl.searchParams.get("id"));
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const deleted = deletePlushie(id);
  if (!deleted) {
    return NextResponse.json({ error: "Plushie not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
