import { redis } from "@/lib/upstash/client";

import { clickKey, geoKey, ipKey, MATCH_WINDOW_SECONDS } from "./keys";
import { confidenceFromScore, MAX_SCORE, scoreSignals } from "./score";
import type { ClickRecord, InstallInput, MatchResult } from "./types";

// Resolves the link an install is attributed to, or null (organic).
export async function matchInstall(
  input: InstallInput,
): Promise<MatchResult | null> {
  // Deterministic: a provided clickId commits to the exact path. If it doesn't
  // resolve (expired or bogus), return no match rather than fall through —
  // probabilistic scoring could only mis-attribute it to a different click.
  if (input.clickId) {
    const click = await redis.get<ClickRecord>(clickKey(input.clickId));
    if (!click) {
      console.warn("[match] deterministic clickId unresolved", {
        clickId: input.clickId,
      });
      return null;
    }
    console.info("[match] deterministic hit", {
      clickId: input.clickId,
      linkId: click.linkId,
    });
    return { linkId: click.linkId, matchType: "deterministic", confidence: 1 };
  }

  // Probabilistic: gather candidates sharing the install's anchors. The install
  // always has a real IP, so it queries the IP index (non-relay clicks) and the
  // geo index (relay clicks, which were indexed by coarse geo).
  const since = Date.now() - MATCH_WINDOW_SECONDS * 1000;
  const ipIds = await recentIds(ipKey(input.ipHash), since);
  const geoIds =
    input.country && input.region
      ? await recentIds(geoKey(input.country, input.region), since)
      : [];
  const ids = new Set<string>([...ipIds, ...geoIds]);

  console.info("[match] probabilistic candidates", {
    ipHash: input.ipHash,
    hasGeo: Boolean(input.country && input.region),
    ipCandidates: ipIds.length,
    geoCandidates: geoIds.length,
    uniqueCandidates: ids.size,
  });

  if (ids.size === 0) {
    console.info("[match] organic", { reason: "no_candidates" });
    return null;
  }

  const clicks = await getClicks([...ids]);
  if (clicks.length < ids.size) {
    // Some indexed clickIds no longer resolve — their records expired.
    console.warn("[match] candidate records missing", {
      candidates: ids.size,
      records: clicks.length,
    });
  }
  if (clicks.length === 0) {
    console.info("[match] organic", { reason: "no_records" });
    return null;
  }

  // Rank by signal agreement, breaking ties by recency.
  const scored = clicks
    .map((click) => ({
      click,
      score: scoreSignals(input.signals, click.signals),
    }))
    .sort(
      (a, b) => b.score - a.score || b.click.capturedAt - a.click.capturedAt,
    );
  const [best, second] = scored;
  const confidence = confidenceFromScore(best.score);

  console.info("[match] probabilistic hit", {
    linkId: best.click.linkId,
    records: clicks.length,
    bestScore: best.score,
    // The runner-up score exposes how decisive the win was (tuning signal).
    secondScore: second?.score ?? null,
    maxScore: MAX_SCORE,
    confidence,
  });

  return {
    linkId: best.click.linkId,
    matchType: "probabilistic",
    confidence,
  };
}

// Candidate clickIds recorded under `key` within the match window.
async function recentIds(key: string, since: number): Promise<string[]> {
  return redis.zrange<string[]>(key, since, "+inf", { byScore: true });
}

async function getClicks(clickIds: string[]): Promise<ClickRecord[]> {
  if (clickIds.length === 0) return [];
  const records = await redis.mget<(ClickRecord | null)[]>(
    ...clickIds.map(clickKey),
  );
  return records.filter((r): r is ClickRecord => r !== null);
}
