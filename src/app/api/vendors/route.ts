import { NextRequest, NextResponse } from "next/server";
import {
  createVendor,
  deleteVendor,
  getAllVendors,
  updateVendor,
} from "@/lib/vendors";
import { parseJsonBody, requireAuth } from "@/lib/api";
import { saveImage } from "@/lib/uploads";
import type { VendorInput } from "@/types";

function parseVendorFormData(formData: FormData): VendorInput & { logoFile: File | null } {
  const logoEntry = formData.get("logo");
  const logoFile = logoEntry instanceof File && logoEntry.size > 0 ? logoEntry : null;

  return {
    name: String(formData.get("name") ?? ""),
    short_description: String(formData.get("short_description") ?? ""),
    description: String(formData.get("description") ?? ""),
    website_url: String(formData.get("website_url") ?? ""),
    location: String(formData.get("location") ?? ""),
    remove_logo: formData.get("remove_logo") === "true",
    logoFile,
  };
}

async function parseVendorInput(
  request: NextRequest
): Promise<(VendorInput & { id?: number }) | NextResponse> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const { logoFile, ...input } = parseVendorFormData(formData);
    const id = formData.get("id");

    if (logoFile) {
      try {
        input.logo_path = await saveImage(logoFile);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to upload logo";
        return NextResponse.json({ error: message }, { status: 400 });
      }
    }

    return {
      ...input,
      id: id ? Number(id) : undefined,
    };
  }

  const body = await parseJsonBody<VendorInput & { id?: number }>(request);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  return body;
}

export async function GET() {
  const vendors = getAllVendors();
  return NextResponse.json(vendors);
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const parsed = await parseVendorInput(request);
  if (parsed instanceof NextResponse) return parsed;

  if (!parsed.name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const vendor = createVendor(parsed);
  return NextResponse.json(vendor, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const parsed = await parseVendorInput(request);
  if (parsed instanceof NextResponse) return parsed;

  if (!parsed.id || !parsed.name?.trim()) {
    return NextResponse.json({ error: "ID and name are required" }, { status: 400 });
  }

  const vendor = updateVendor(parsed.id, parsed);
  if (!vendor) {
    return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
  }

  return NextResponse.json(vendor);
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const id = Number(request.nextUrl.searchParams.get("id"));
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const deleted = deleteVendor(id);
  if (!deleted) {
    return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
