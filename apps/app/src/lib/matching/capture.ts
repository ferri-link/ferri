import { randomUUID } from "node:crypto";

import { hashIp } from "./ip";
import type { ClickInput } from "./types";

// Builds a click from an incoming request's headers: reads the client IP, coarse
// geo, and the server-available signals (user-agent, languages), hashes the IP
// at this boundary, and mints the click's opaque id. Framework-agnostic — takes
// a standard Headers object.
export function buildClickInput(headers: Headers, linkId: string): ClickInput {
  return {
    clickId: randomUUID(),
    linkId,
    ipHash: hashIp(clientIp(headers)),
    // Relay detection isn't built yet: until it is, relay clicks index under a
    // dead IP key and won't match. TODO: detect it, set viaPrivateRelay + geo.
    viaPrivateRelay: false,
    country: headers.get("x-vercel-ip-country") ?? undefined,
    region: headers.get("x-vercel-ip-country-region") ?? undefined,
    signals: {
      userAgent: headers.get("user-agent") ?? undefined,
      languages: parseLanguages(headers.get("accept-language")),
      // timezone and screen need client-side JS (a future intermediate page).
    },
  };
}

// The client IP as seen at the edge. x-forwarded-for is a comma-separated list;
// the first entry is the originating client.
function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "";
}

// Accept-Language ("en-GB,en;q=0.9,fr;q=0.8") → ordered tags, q-values dropped.
function parseLanguages(header: string | null): string[] | undefined {
  if (!header) return undefined;
  const tags = header
    .split(",")
    .map((part) => part.split(";")[0].trim())
    .filter(Boolean);
  return tags.length ? tags : undefined;
}
