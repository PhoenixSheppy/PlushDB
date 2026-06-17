"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowRightToBracket,
  faGear,
  faHandHoldingHand,
  faRightFromBracket,
  faStore,
  faTableCells,
} from "@fortawesome/free-solid-svg-icons";
import "@/lib/fontawesome";

type NavItemProps = {
  href: string;
  label: string;
  icon: IconDefinition;
  active: boolean;
};

function NavItem({ href, label, icon, active }: NavItemProps) {
  const className = `inline-flex items-center rounded-md px-2 py-1.5 transition-colors hover:bg-surface-overlay sm:gap-2 sm:px-3 ${
    active ? "text-accent" : "text-text-muted hover:text-text"
  }`;

  return (
    <Link href={href} aria-label={label} title={label} className={className}>
      <FontAwesomeIcon icon={icon} className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}

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
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="flex items-center gap-2 text-base font-semibold sm:text-lg">
          <span className="logo-icon-wrap">
            <FontAwesomeIcon icon={faHandHoldingHand} className="logo-icon h-4 w-4 text-accent" />
          </span>
          <span>PlushBroker</span>
        </Link>

        <nav className="flex items-center gap-1.5 text-sm sm:gap-3">
          <NavItem
            href="/"
            label="Gallery"
            icon={faTableCells}
            active={pathname === "/"}
          />
          <NavItem
            href="/vendors"
            label="Vendors"
            icon={faStore}
            active={pathname === "/vendors"}
          />

          {session?.isLoggedIn ? (
            <>
              <NavItem
                href="/manage"
                label="Manage"
                icon={faGear}
                active={pathname === "/manage"}
              />
              <span className="hidden text-text-muted md:inline">{session.username}</span>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Log out"
                title="Log out"
                className="inline-flex items-center rounded-md border border-border px-2 py-1.5 text-text-muted transition-colors hover:border-border hover:bg-surface-overlay hover:text-text sm:gap-2 sm:px-3"
              >
                <FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-4" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </>
          ) : (
            <NavItem
              href="/login"
              label="Log in"
              icon={faArrowRightToBracket}
              active={pathname === "/login"}
            />
          )}
        </nav>
      </div>
    </header>
  );
}
