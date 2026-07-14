import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllPlushies, getPlushieById, getPlushieCount } from "@/lib/plushies";
import { isAuthenticated } from "@/lib/auth";
import { buildPlushieMetadata } from "@/lib/plushie-og";
import { parsePlushieId } from "@/lib/plushie-url";
import { GalleryContent } from "@/components/GalleryContent";
import "@/lib/fontawesome";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ plushie?: string | string[] }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const raw = Array.isArray(params.plushie) ? params.plushie[0] : params.plushie;
  const id = parsePlushieId(raw);
  if (!id) {
    return buildPlushieMetadata(null);
  }

  return buildPlushieMetadata(getPlushieById(id));
}

export default async function HomePage() {
  const [plushies, count, loggedIn] = await Promise.all([
    getAllPlushies(),
    Promise.resolve(getPlushieCount()),
    isAuthenticated(),
  ]);

  return (
    <Suspense fallback={<div className="py-12 text-center text-text-muted">Loading...</div>}>
      <GalleryContent plushies={plushies} count={count} loggedIn={loggedIn} />
    </Suspense>
  );
}
