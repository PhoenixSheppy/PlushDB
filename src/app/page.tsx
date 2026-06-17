import { Suspense } from "react";
import { getAllPlushies, getPlushieCount } from "@/lib/plushies";
import { isAuthenticated } from "@/lib/auth";
import { GalleryContent } from "@/components/GalleryContent";
import "@/lib/fontawesome";

export const dynamic = "force-dynamic";

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
