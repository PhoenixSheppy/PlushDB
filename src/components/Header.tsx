"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faGear,
  faHandHoldingHand,
  faStore,
  faTableCells,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthSession } from "@/lib/use-auth-session";
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
  const session = useAuthSession();

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

          {session?.isLoggedIn && (
            <NavItem
              href="/manage"
              label="Manage"
              icon={faGear}
              active={pathname === "/manage"}
            />
          )}
        </nav>
      </div>
    </header>
  );
}
