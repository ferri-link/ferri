import { redis } from "@/lib/upstash/client";

import {
  CLICK_TTL_SECONDS,
  clickKey,
  geoKey,
  ipKey,
  MATCH_WINDOW_SECONDS,
} from "./keys";
import type { ClickInput, ClickRecord, MatchSignals } from "./types";

// Records a click in the KV match store: the click record (kept for the long
// deterministic clickId window) plus one recency-scored index entry under the
// anchor the install will share (kept for the shorter probabilistic window).
// Both expire on their own.
export async function recordClick(click: ClickInput): Promise<void> {
  const record: ClickRecord = { ...click, capturedAt: Date.now() };
  const pipeline = redis.pipeline();

  pipeline.set(clickKey(record.clickId), record, { ex: CLICK_TTL_SECONDS });

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

// Merges client-collected signals (timezone, screen — which a server redirect
// can't see) into an already-recorded click, preserving its TTL. No-op if the
// click has expired or is unknown.
export async function enrichClickSignals(
  clickId: string,
  signals: Partial<MatchSignals>,
): Promise<void> {
  const record = await redis.get<ClickRecord>(clickKey(clickId));
  if (!record) return;

  const merged: ClickRecord = {
    ...record,
    signals: { ...record.signals, ...signals },
  };
  await redis.set(clickKey(clickId), merged, { keepTtl: true });
}
