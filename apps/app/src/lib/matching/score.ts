import type { MatchSignals } from "./types";

// Weighted agreement between an install's signals and a candidate click's.
// These weights are a starting point — tune against real match data.
export const WEIGHTS = { userAgent: 3, timezone: 2, screen: 2, languages: 1 };
export const MAX_SCORE =
  WEIGHTS.userAgent + WEIGHTS.timezone + WEIGHTS.screen + WEIGHTS.languages;

export function scoreSignals(a: MatchSignals, b: MatchSignals): number {
  let score = 0;
  if (a.userAgent && a.userAgent === b.userAgent) score += WEIGHTS.userAgent;
  if (a.timezone && a.timezone === b.timezone) score += WEIGHTS.timezone;
  if (a.screen && b.screen && sameScreen(a.screen, b.screen))
    score += WEIGHTS.screen;
  if (sameOrder(a.languages, b.languages)) score += WEIGHTS.languages;
  return score;
}

// Ceiling for probabilistic confidence, kept strictly below the deterministic
// 1.0. Even full signal agreement can be a coincidence (identical devices on a
// shared IP), so it must read as less certain than an exact clickId match.
export const PROBABILISTIC_MAX = 0.9;

// The anchor already matched (that's why it's a candidate), so confidence starts
// at 0.5 and scales with signal agreement up to PROBABILISTIC_MAX.
export function confidenceFromScore(score: number): number {
  return 0.5 + (score / MAX_SCORE) * (PROBABILISTIC_MAX - 0.5);
}

function sameScreen(
  a: NonNullable<MatchSignals["screen"]>,
  b: NonNullable<MatchSignals["screen"]>,
): boolean {
  return a.width === b.width && a.height === b.height && a.scale === b.scale;
}

function sameOrder(a?: string[], b?: string[]): boolean {
  if (!a?.length || !b?.length || a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}
