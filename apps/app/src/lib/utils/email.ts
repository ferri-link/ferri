// Common role-based / non-personal email local parts that shouldn't be
// suggested as a person's display name.
const NON_NAME_LOCAL_PARTS = new Set([
  "admin",
  "administrator",
  "info",
  "contact",
  "hello",
  "hi",
  "hey",
  "support",
  "help",
  "helpdesk",
  "team",
  "sales",
  "billing",
  "account",
  "accounts",
  "office",
  "mail",
  "email",
  "noreply",
  "no-reply",
  "donotreply",
  "marketing",
  "press",
  "media",
  "legal",
  "security",
  "abuse",
  "postmaster",
  "webmaster",
  "root",
  "user",
  "test",
]);

// Suggests a display name from an email address. Returns an empty string for
// role-based addresses (support@, admin@, hi@, …); otherwise capitalizes each
// word of the local part, e.g. "ada.lovelace" → "Ada Lovelace".
export function suggestNameFromEmail(email: string | undefined): string {
  // Drop the domain and any "+tag" suffix, then normalize.
  const localPart = email?.split("@")[0]?.split("+")[0]?.trim().toLowerCase();
  if (!localPart || NON_NAME_LOCAL_PARTS.has(localPart)) {
    return "";
  }

  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
