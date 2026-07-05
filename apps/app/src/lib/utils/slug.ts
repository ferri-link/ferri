// Turns arbitrary text into a URL-safe slug: lowercase, alphanumeric words
// joined by single hyphens, e.g. "My App!" → "my-app".
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Slugs reserved for the platform — app routes, subdomains, and common terms
// we may want for ourselves — that projects aren't allowed to claim.
export const RESERVED_SLUGS = new Set([
  "account",
  "accounts",
  "admin",
  "api",
  "app",
  "apps",
  "assets",
  "auth",
  "billing",
  "blog",
  "cdn",
  "contact",
  "create",
  "dashboard",
  "docs",
  "ferri",
  "files",
  "folders",
  "help",
  "internal",
  "links",
  "login",
  "logout",
  "mail",
  "me",
  "new",
  "pricing",
  "privacy",
  "project",
  "projects",
  "public",
  "settings",
  "signin",
  "sign-in",
  "signup",
  "sign-up",
  "static",
  "status",
  "support",
  "system",
  "terms",
  "test",
  "tests",
  "testing",
  "user",
  "users",
  "www",
]);

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}
