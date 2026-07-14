import type { Metadata } from "next";
import type { Plushie } from "@/types";
import { formatDate } from "@/lib/format";
import { getPlushieSharePath } from "@/lib/plushie-url";
import { getSiteOrigin } from "@/lib/site-url";

const DEFAULT_TITLE = "PlushBroker — A Collection of Plushies";
const DEFAULT_DESCRIPTION = "A cozy collection of plushie friends";

export function buildPlushieEmbedDescription(plushie: Plushie): string {
  const acquired = formatDate(plushie.acquired_date);
  const bits = [
    plushie.species,
    plushie.manufacturer,
    acquired ? `Acquired: ${acquired}` : "",
  ].filter(Boolean);
  const header = bits.length > 0 ? bits.join(" · ") : "";
  const body = plushie.description.trim();

  let text: string;
  if (header && body) {
    // Discord / Telegram preserve newlines in OG descriptions (not rich markdown).
    text = `${header}\n\n${body}`;
  } else {
    text = header || body || "A plushie in the PlushBroker collection";
  }

  return text.length > 280 ? `${text.slice(0, 277)}…` : text;
}

export async function buildPlushieMetadata(plushie: Plushie | null): Promise<Metadata> {
  if (!plushie) {
    return {
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
    };
  }

  const origin = await getSiteOrigin();
  const path = getPlushieSharePath(plushie.id);
  const url = `${origin}${path}`;
  const title = `${plushie.name} — PlushBroker`;
  const description = buildPlushieEmbedDescription(plushie);
  const imageUrl = plushie.image_path
    ? `${origin}/api/uploads/${plushie.image_path}`
    : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "PlushBroker",
      ...(imageUrl
        ? {
            images: [
              {
                url: imageUrl,
                width: 400,
                height: 400,
                alt: plushie.name,
              },
            ],
          }
        : {}),
    },
    twitter: {
      // `summary` = small square thumbnail on the left (Discord, Telegram, etc.)
      card: "summary",
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}
