import { beforeEach, describe, expect, it, vi } from "vitest";

const { get, zrange, mget } = vi.hoisted(() => ({
  get: vi.fn(),
  zrange: vi.fn(),
  mget: vi.fn(),
}));

vi.mock("@/lib/upstash/client", () => ({
  redis: { get, zrange, mget },
}));

import { matchInstall } from "./match";
import { PROBABILISTIC_MAX } from "./score";
import type { ClickRecord, InstallInput, MatchSignals } from "./types";

const SIGNALS: MatchSignals = {
  userAgent: "UA/1.0",
  timezone: "Europe/London",
  languages: ["en-GB"],
  screen: { width: 390, height: 844, scale: 3 },
};

function clickRecord(over: Partial<ClickRecord> = {}): ClickRecord {
  return {
    clickId: "c1",
    linkId: "link_1",
    ipHash: "iphash",
    viaPrivateRelay: false,
    signals: SIGNALS,
    capturedAt: 1000,
    ...over,
  };
}

function install(over: Partial<InstallInput> = {}): InstallInput {
  return { ipHash: "iphash", signals: SIGNALS, ...over };
}

// Matcher logs to console; keep test output quiet.
vi.spyOn(console, "info").mockImplementation(() => {});
vi.spyOn(console, "warn").mockImplementation(() => {});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("matchInstall — deterministic", () => {
  it("returns a deterministic match when the clickId resolves", async () => {
    get.mockResolvedValue(clickRecord({ clickId: "c9", linkId: "link_9" }));

    const result = await matchInstall(install({ clickId: "c9" }));

    expect(result).toEqual({
      linkId: "link_9",
      matchType: "deterministic",
      confidence: 1,
    });
    expect(get).toHaveBeenCalledWith("click:c9");
    // A provided clickId must never fall through to probabilistic.
    expect(zrange).not.toHaveBeenCalled();
  });

  it("fails closed (null, no fall-through) when the clickId is unresolved", async () => {
    get.mockResolvedValue(null);

    const result = await matchInstall(install({ clickId: "gone" }));

    expect(result).toBeNull();
    expect(zrange).not.toHaveBeenCalled();
    expect(mget).not.toHaveBeenCalled();
  });
});

describe("matchInstall — probabilistic", () => {
  it("matches on a shared IP and scores confidence from signal agreement", async () => {
    zrange.mockResolvedValue(["c1"]);
    mget.mockResolvedValue([clickRecord({ clickId: "c1", linkId: "link_1" })]);

    const result = await matchInstall(install());

    // Identical signals → full score → confidence capped at PROBABILISTIC_MAX,
    // never the deterministic 1.0.
    expect(result).toEqual({
      linkId: "link_1",
      matchType: "probabilistic",
      confidence: PROBABILISTIC_MAX,
    });
  });

  it("ranks candidates by signal agreement", async () => {
    zrange.mockResolvedValue(["weak", "strong"]);
    mget.mockResolvedValue([
      clickRecord({
        clickId: "weak",
        linkId: "link_weak",
        signals: { timezone: SIGNALS.timezone },
      }),
      clickRecord({ clickId: "strong", linkId: "link_strong", signals: SIGNALS }),
    ]);

    const result = await matchInstall(install());

    expect(result?.linkId).toBe("link_strong");
  });

  it("breaks ties by recency", async () => {
    zrange.mockResolvedValue(["older", "newer"]);
    mget.mockResolvedValue([
      clickRecord({ clickId: "older", linkId: "link_old", capturedAt: 1000 }),
      clickRecord({ clickId: "newer", linkId: "link_new", capturedAt: 2000 }),
    ]);

    const result = await matchInstall(install());

    expect(result?.linkId).toBe("link_new");
  });

  it("also queries the geo index and de-duplicates candidates", async () => {
    zrange.mockImplementation((key: string) =>
      Promise.resolve(key.startsWith("ip:") ? ["c1"] : ["c1", "c2"]),
    );
    mget.mockResolvedValue([
      clickRecord({ clickId: "c1", linkId: "link_1", signals: {} }),
      clickRecord({ clickId: "c2", linkId: "link_2", signals: SIGNALS }),
    ]);

    const result = await matchInstall(install({ country: "GB", region: "ENG" }));

    expect(zrange).toHaveBeenCalledTimes(2);
    expect(mget).toHaveBeenCalledWith("click:c1", "click:c2");
    expect(result?.linkId).toBe("link_2");
  });

  it("returns null when no click shares the anchor", async () => {
    zrange.mockResolvedValue([]);

    const result = await matchInstall(install());

    expect(result).toBeNull();
    expect(mget).not.toHaveBeenCalled();
  });

  it("returns null when candidate records have expired", async () => {
    zrange.mockResolvedValue(["c1"]);
    mget.mockResolvedValue([null]);

    const result = await matchInstall(install());

    expect(result).toBeNull();
  });
});
