export function getPlushieSharePath(id: number): string {
  return `/?plushie=${id}`;
}

export function getPlushieShareUrl(id: number): string {
  if (typeof window === "undefined") return getPlushieSharePath(id);
  return `${window.location.origin}${getPlushieSharePath(id)}`;
}

export function parsePlushieId(value: string | null | undefined): number | null {
  if (!value) return null;
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}
