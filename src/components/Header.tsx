"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightArrowLeft, faHandHoldingHand } from "@fortawesome/free-solid-svg-icons";
import "@/lib/fontawesome";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<{ isLoggedIn: boolean; username: string | null } | null>(
    null
  );

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then(setSession)
      .catch(() => setSession({ isLoggedIn: false, username: null }));
  }, [pathname]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setSession({ isLoggedIn: false, username: null });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <span className="logo-icon-wrap">
            <FontAwesomeIcon icon={faHandHoldingHand} className="logo-icon h-4 w-4 text-accent" />
          </span>
          <span>PlushBroker</span>
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          <Link
            href="/"
            className={`rounded-md px-3 py-1.5 transition-colors hover:bg-surface-overlay ${
              pathname === "/" ? "text-accent" : "text-text-muted hover:text-text"
            }`}
          >
            Gallery
          </Link>

          {session?.isLoggedIn ? (
            <>
              <Link
                href="/manage"
                className={`rounded-md px-3 py-1.5 transition-colors hover:bg-surface-overlay ${
                  pathname === "/manage" ? "text-accent" : "text-text-muted hover:text-text"
                }`}
              >
                Manage
              </Link>
              <span className="hidden text-text-muted sm:inline">
                {session.username}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-md border border-border px-3 py-1.5 text-text-muted transition-colors hover:border-border hover:bg-surface-overlay hover:text-text"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className={`rounded-md px-3 py-1.5 transition-colors hover:bg-surface-overlay ${
                pathname === "/login" ? "text-accent" : "text-text-muted hover:text-text"
              }`}
            >
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
