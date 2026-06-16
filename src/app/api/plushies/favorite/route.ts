import { NextRequest, NextResponse } from "next/server";
import { toggleFavorite } from "@/lib/plushies";
import { requireAuth } from "@/lib/api";

export async function PATCH(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const id = Number(request.nextUrl.searchParams.get("id"));
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const plushie = toggleFavorite(id);
  if (!plushie) {
    return NextResponse.json({ error: "Plushie not found" }, { status: 404 });
  }

  return NextResponse.json(plushie);
}
