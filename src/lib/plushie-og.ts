import type { Metadata } from "next";
import type { Plushie } from "@/types";
import { getPlushieSharePath } from "@/lib/plushie-url";
import { getSiteOrigin } from "@/lib/site-url";

const DEFAULT_TITLE = "PlushBroker — A Collection of Plushies";
const DEFAULT_DESCRIPTION = "A cozy collection of plushie friends";

export function buildPlushieEmbedDescription(plushie: Plushie): string {
  const bits = [plushie.species, plushie.manufacturer].filter(Boolean);
  const header = bits.length > 0 ? bits.join(" · ") : "A plushie in the PlushBroker collection";
  const body = plushie.description.trim();
  if (!body) return header;

  const combined = `${header} — ${body}`;
  return combined.length > 280 ? `${combined.slice(0, 277)}…` : combined;
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
                alt: plushie.name,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}
