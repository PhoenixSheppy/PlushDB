"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export type AuthSession = {
  isLoggedIn: boolean;
  username: string | null;
};

export function useAuthSession(): AuthSession | null {
  const pathname = usePathname();
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then(setSession)
      .catch(() => setSession({ isLoggedIn: false, username: null }));
  }, [pathname]);

  return session;
}
