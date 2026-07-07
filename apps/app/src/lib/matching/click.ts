import { redis } from "@/lib/upstash/client";

// How long a click stays matchable. Tune to the deferred-install window: longer
// catches slower installs, shorter reduces false matches.
const MATCH_WINDOW_SECONDS = 15 * 60; // 15 minutes

const clickKey = (clickId: string) => `click:${clickId}`;
const ipKey = (ipHash: string) => `ip:${ipHash}`;
const geoKey = (country: string, region: string) => `geo:${country}:${region}`;

// Scoring signals used to rank candidates that share an anchor (they are not
// indexed). Each is compared against the install's equivalent, so a signal only
// helps when collected the same way on both sides. All optional: a click is
// captured with whatever the request and client-side collection can provide.
export type ClickSignals = {
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
  // Scoring signals (stored, not indexed). See ClickSignals.
  signals: ClickSignals;
  // Epoch ms; the recency score in the index sorted sets. Stamped on write.
  capturedAt: number;
};

// A click as captured, before capturedAt is stamped on write.
export type ClickInput = Omit<ClickRecord, "capturedAt">;

// Records a click in the KV match store: the click itself (for the
// deterministic clickId lookup) plus one recency-scored index entry under the
// anchor the install will share. TTL'd so unmatched clicks expire on their own.
export async function recordClick(click: ClickInput): Promise<void> {
  const record: ClickRecord = { ...click, capturedAt: Date.now() };
  const pipeline = redis.pipeline();

  pipeline.set(clickKey(record.clickId), record, { ex: MATCH_WINDOW_SECONDS });

  if (!record.viaPrivateRelay) {
    const key = ipKey(record.ipHash);
    pipeline.zadd(key, { score: record.capturedAt, member: record.clickId });
    pipeline.expire(key, MATCH_WINDOW_SECONDS);
  } else if (record.country && record.region) {
    const key = geoKey(record.country, record.region);
    pipeline.zadd(key, { score: record.capturedAt, member: record.clickId });
    pipeline.expire(key, MATCH_WINDOW_SECONDS);
  }

  await pipeline.exec();
}
