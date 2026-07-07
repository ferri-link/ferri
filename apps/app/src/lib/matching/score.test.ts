import { describe, expect, it } from "vitest";

import {
  confidenceFromScore,
  MAX_SCORE,
  PROBABILISTIC_MAX,
  scoreSignals,
} from "./score";
import type { MatchSignals } from "./types";

const FULL: MatchSignals = {
  userAgent: "UA/1.0",
  timezone: "Europe/London",
  languages: ["en-GB", "fr-FR"],
  screen: { width: 390, height: 844, scale: 3 },
};

describe("scoreSignals", () => {
  it("awards the full weight for identical signals", () => {
    expect(scoreSignals(FULL, FULL)).toBe(MAX_SCORE);
    expect(MAX_SCORE).toBe(8);
  });

  it("awards nothing when every signal differs", () => {
    const other: MatchSignals = {
      userAgent: "UA/2.0",
      timezone: "America/New_York",
      languages: ["de-DE"],
      screen: { width: 1, height: 2, scale: 1 },
    };
    expect(scoreSignals(FULL, other)).toBe(0);
  });

  it("weights each signal independently", () => {
    expect(scoreSignals(FULL, { userAgent: FULL.userAgent })).toBe(3);
    expect(scoreSignals(FULL, { timezone: FULL.timezone })).toBe(2);
    expect(scoreSignals(FULL, { screen: FULL.screen })).toBe(2);
    expect(scoreSignals(FULL, { languages: FULL.languages })).toBe(1);
  });

  it("ignores missing signals on either side", () => {
    expect(scoreSignals({}, {})).toBe(0);
    expect(scoreSignals(FULL, {})).toBe(0);
    expect(scoreSignals({}, FULL)).toBe(0);
  });

  it("requires an exact screen match (all dimensions)", () => {
    const nearly = { ...FULL, screen: { width: 390, height: 844, scale: 2 } };
    expect(scoreSignals(FULL, nearly)).toBe(MAX_SCORE - 2);
  });

  it("treats language order as significant", () => {
    const reordered = { ...FULL, languages: ["fr-FR", "en-GB"] };
    expect(scoreSignals(FULL, reordered)).toBe(MAX_SCORE - 1);
  });

  it("does not match languages of differing length or when empty", () => {
    expect(scoreSignals(FULL, { languages: ["en-GB"] })).toBe(0);
    expect(scoreSignals(FULL, { languages: [] })).toBe(0);
  });
});

describe("confidenceFromScore", () => {
  it("floors at 0.5 (the anchor already matched)", () => {
    expect(confidenceFromScore(0)).toBe(0.5);
  });

  it("caps at PROBABILISTIC_MAX, strictly below the deterministic 1.0", () => {
    expect(confidenceFromScore(MAX_SCORE)).toBe(PROBABILISTIC_MAX);
    expect(confidenceFromScore(MAX_SCORE)).toBeLessThan(1);
  });

  it("scales linearly between the floor and the cap", () => {
    expect(confidenceFromScore(MAX_SCORE / 2)).toBeCloseTo(0.7);
  });
});
