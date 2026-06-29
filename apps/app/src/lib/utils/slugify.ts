// Turns arbitrary text into a URL-safe slug: lowercase, alphanumeric words
// joined by single hyphens, e.g. "My App!" → "my-app".
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
