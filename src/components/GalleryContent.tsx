"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FAVORITE_TRAIT } from "@/lib/traits";
import { parsePlushieId } from "@/lib/plushie-url";
import type { Plushie } from "@/types";
import { CollectionStats } from "./CollectionStats";
import { PlushieDetailModal } from "./PlushieDetailModal";
import { PlushieGrid } from "./PlushieGrid";
import "@/lib/fontawesome";

type Props = {
  plushies: Plushie[];
  count: number;
  loggedIn: boolean;
};

export function GalleryContent({ plushies, count, loggedIn }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<Plushie | null>(null);

  const favorites = plushies.filter((p) => p.is_favorite);
  const nonFavorites = plushies.filter((p) => !p.is_favorite);

  useEffect(() => {
    const id = parsePlushieId(searchParams.get("plushie"));
    if (!id) {
      setSelected(null);
      return;
    }
    setSelected(plushies.find((p) => p.id === id) ?? null);
  }, [searchParams, plushies]);

  function openPlushie(plushie: Plushie) {
    setSelected(plushie);
    router.replace(`/?plushie=${plushie.id}`, { scroll: false });
  }

  function closePlushie() {
    setSelected(null);
    router.replace("/", { scroll: false });
  }

  return (
    <>
      <div className="space-y-10">
        <section className="space-y-4 pt-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Meet the <span className="text-accent">Pack</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-text-muted">
            A cozy little collection of my soft friends — their names, a little about them, and a
            picture all in one place.
          </p>
          <CollectionStats total={count} favorites={favorites.length} />
          {loggedIn && (
            <Link
              href="/manage"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-surface transition-colors hover:bg-accent-hover"
            >
              Manage Collection
            </Link>
          )}
        </section>

        {favorites.length > 0 && (
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <FontAwesomeIcon icon={FAVORITE_TRAIT.iconActive} className="h-4 w-4 text-accent" />
              Favorites
            </h2>
            <PlushieGrid plushies={favorites} onSelect={openPlushie} />
          </section>
        )}

        {(favorites.length === 0 || nonFavorites.length > 0) && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">
              {favorites.length > 0 ? "All Plushies" : "Collection"}
            </h2>
            {plushies.length === 0 ? (
              <EmptyState loggedIn={loggedIn} />
            ) : (
              <PlushieGrid
                plushies={favorites.length > 0 ? nonFavorites : plushies}
                onSelect={openPlushie}
              />
            )}
          </section>
        )}
      </div>

      {selected && <PlushieDetailModal plushie={selected} onClose={closePlushie} />}
    </>
  );
}

function EmptyState({ loggedIn }: { loggedIn: boolean }) {
  return (
    <div className="glass space-y-4 rounded-2xl p-12 text-center">
      <p className="text-text-muted">No plushies cataloged yet.</p>
      {loggedIn ? (
        <Link
          href="/manage"
          className="inline-flex rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-surface hover:bg-accent-hover"
        >
          Add your first plushie
        </Link>
      ) : (
        <p className="text-sm text-text-muted">
          <Link href="/login" className="text-accent hover:underline">
            Log in
          </Link>{" "}
          to start building your collection.
        </p>
      )}
    </div>
  );
}
