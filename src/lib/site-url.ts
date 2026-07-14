import { headers } from "next/headers";

/** Absolute site origin for Open Graph / share embeds. Prefer SITE_URL when set. */
export async function getSiteOrigin(): Promise<string> {
  const configured = process.env.SITE_URL?.trim().replace(/\/$/, "");
  if (configured) return configured;

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return "http://localhost:3000";

  const proto =
    h.get("x-forwarded-proto") ?? (host.includes("localhost") || host.startsWith("127.") ? "http" : "https");

  return `${proto}://${host}`;
}
