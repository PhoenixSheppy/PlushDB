import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import { getAllPlushies, getPlushieCount } from "@/lib/plushies";
import { isAuthenticated } from "@/lib/auth";
import { FAVORITE_TRAIT } from "@/lib/traits";
import { PlushieGrid } from "@/components/PlushieGrid";
import { CollectionStats } from "@/components/CollectionStats";
import { GalleryFooter } from "@/components/GalleryFooter";
import "@/lib/fontawesome";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [plushies, count, loggedIn] = await Promise.all([
    getAllPlushies(),
    Promise.resolve(getPlushieCount()),
    isAuthenticated(),
  ]);

  const favorites = plushies.filter((p) => p.is_favorite);
  const nonFavorites = plushies.filter((p) => !p.is_favorite);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-10">
      <section className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-raised px-4 py-1.5 text-sm text-text-muted">
          <FontAwesomeIcon icon={faPeopleGroup} className="h-4 w-4 text-accent" />
          <span>Phoenix&apos;s Plushie Collection</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Meet the <span className="text-accent">Pack</span>
        </h1>
        <p className="mx-auto max-w-xl text-text-muted text-lg">
          A cozy little collection of my soft friends — their names, a little about them, and a picture all in one place.
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
          <PlushieGrid plushies={favorites} showAdmin={false} />
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
              showAdmin={false}
            />
          )}
        </section>
      )}

      </div>

      <GalleryFooter />
    </div>
  );
}

function EmptyState({ loggedIn }: { loggedIn: boolean }) {
  return (
    <div className="glass rounded-2xl p-12 text-center space-y-4">
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
