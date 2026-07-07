// Domain types for the matching mechanism. Shared by the write (click) and read
// (match) sides; the logic lives in click.ts / match.ts.

// Scoring signals used to rank candidates that share an anchor (they are not
// indexed). Each is compared against the install's equivalent, so a signal only
// helps when collected the same way on both sides. All optional: a click is
// captured with whatever the request and client-side collection can provide.
export type MatchSignals = {
  userAgent?: string;
  timezone?: string;
  // Ordered preferred-language list, most-preferred first.
  languages?: string[];
  screen?: { width: number; height: number; scale: number };
};

export type ClickRecord = {
  clickId: string;
  linkId: string;
  // Peppered hash of the request IP. The primary match anchor for non-relay
  // clicks; a dead key for relay clicks (see viaPrivateRelay).
  ipHash: string;
  // True when the click came through a privacy relay: the egress IP is the
  // relay's, not the device's, and the install (native HTTPS) bypasses the
  // relay — so ipHash will never match. Relay clicks are indexed by coarse geo
  // instead.
  viaPrivateRelay: boolean;
  // Coarse geo (ISO country + region) — the fallback anchor for relay clicks.
  country?: string;
  region?: string;
  // Scoring signals (stored, not indexed). See MatchSignals.
  signals: MatchSignals;
  // Epoch ms; the recency score in the index sorted sets. Stamped on write.
  capturedAt: number;
};

// A click as captured, before capturedAt is stamped on write.
export type ClickInput = Omit<ClickRecord, "capturedAt">;

// What the device reports on install. The IP is hashed at the request boundary
// (never seen by the matcher); the signals are compared against candidate
// clicks to disambiguate.
export type InstallInput = {
  // Peppered IP hash, computed at the boundary — matches how clicks are indexed.
  ipHash: string;
  country?: string;
  region?: string;
  // Deterministic token carried across the install boundary by the platform's
  // referrer mechanism (Android: Play Install Referrer; iOS: clipboard /
  // universal link / App Clip), if present. Matched exactly, no scoring.
  clickId?: string;
  signals: MatchSignals;
};

export type MatchResult = {
  linkId: string;
  matchType: "deterministic" | "probabilistic";
  confidence: number;
};
