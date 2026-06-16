import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getContentType, isSafeFilename, UPLOADS_DIR } from "@/lib/uploads";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  if (!isSafeFilename(filename)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const filePath = path.join(UPLOADS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const buffer = fs.readFileSync(filePath);
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": getContentType(filename),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
