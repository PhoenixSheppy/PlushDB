export function formatWebsiteUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function websiteHref(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}
